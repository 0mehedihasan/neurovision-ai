from pathlib import Path

import numpy as np
import torch
from PIL import Image
from torchvision.transforms import functional as TF

from app.config import CLASS_NAMES
from app.services.model_service import model_service
from app.services.preprocessing import preprocess_image


class GradCAM:

    def __init__(self, model):

        self.model = model
        self.activations = None
        self.gradients = None

        self.target_layer = (
            self.model.features[-1]
        )

        self.forward_handle = (
            self.target_layer.register_forward_hook(
                self._forward_hook
            )
        )

        self.backward_handle = (
            self.target_layer.register_full_backward_hook(
                self._backward_hook
            )
        )

    def _forward_hook(
        self,
        module,
        inputs,
        output
    ):

        self.activations = output

    def _backward_hook(
        self,
        module,
        grad_input,
        grad_output
    ):

        self.gradients = grad_output[0]

    def generate(
        self,
        image: Image.Image
    ):

        tensor = preprocess_image(
            image
        ).to(
            model_service.device
        )

        self.model.zero_grad(
            set_to_none=True
        )

        logits = self.model(
            tensor
        )

        probabilities = torch.softmax(
            logits,
            dim=1
        )

        predicted_index = int(
            probabilities.argmax(
                dim=1
            ).item()
        )

        score = logits[
            0,
            predicted_index
        ]

        score.backward()

        if self.activations is None:
            raise RuntimeError(
                "Grad-CAM activations were not captured."
            )

        if self.gradients is None:
            raise RuntimeError(
                "Grad-CAM gradients were not captured."
            )

        activations = (
            self.activations[0]
        )

        gradients = (
            self.gradients[0]
        )

        weights = gradients.mean(
            dim=(1, 2),
            keepdim=True
        )

        cam = (
            weights * activations
        ).sum(
            dim=0
        )

        cam = torch.relu(
            cam
        )

        cam = (
            cam
            .detach()
            .cpu()
            .numpy()
        )

        cam_min = cam.min()
        cam_max = cam.max()

        if cam_max > cam_min:

            cam = (
                cam - cam_min
            ) / (
                cam_max - cam_min
            )

        else:

            cam = np.zeros_like(
                cam,
                dtype=np.float32
            )

        return (
            predicted_index,
            probabilities[0]
            .detach()
            .cpu()
            .numpy(),
            cam
        )

    def close(self):

        if self.forward_handle is not None:
            self.forward_handle.remove()

        if self.backward_handle is not None:
            self.backward_handle.remove()


def _create_colormap(
    cam: np.ndarray
) -> np.ndarray:
    """
    Convert normalized Grad-CAM activation
    into a blue -> cyan -> yellow -> red
    heatmap using a simple interpolation.
    """

    cam = np.clip(
        cam,
        0.0,
        1.0
    )

    stops = np.array(
        [
            [0.0, 0.0, 0.0],
            [0.0, 0.0, 1.0],
            [0.0, 1.0, 1.0],
            [1.0, 1.0, 0.0],
            [1.0, 0.0, 0.0],
        ],
        dtype=np.float32
    )

    positions = np.linspace(
        0.0,
        1.0,
        len(stops)
    )

    heatmap = np.zeros(
        (*cam.shape, 3),
        dtype=np.float32
    )

    for channel in range(3):

        heatmap[..., channel] = np.interp(
            cam,
            positions,
            stops[:, channel]
        )

    return (
        heatmap * 255.0
    ).astype(
        np.uint8
    )


def create_gradcam(
    image: Image.Image,
    output_path: Path
):

    gradcam = GradCAM(
        model_service.model
    )

    try:

        (
            predicted_index,
            probabilities,
            cam
        ) = gradcam.generate(
            image
        )

        # Original MRI
        original = image.convert(
            "L"
        )

        original = original.resize(
            (224, 224),
            Image.Resampling.BILINEAR
        )

        original_rgb = Image.merge(
            "RGB",
            (
                original,
                original,
                original,
            )
        )

        # Resize CAM to model input size
        cam_image = Image.fromarray(
            np.uint8(
                cam * 255.0
            ),
            mode="L"
        )

        cam_image = cam_image.resize(
            (224, 224),
            Image.Resampling.BILINEAR
        )

        cam_resized = (
            np.asarray(
                cam_image
            ).astype(
                np.float32
            ) / 255.0
        )

        # Colorize CAM
        heatmap_array = _create_colormap(
            cam_resized
        )

        heatmap = Image.fromarray(
            heatmap_array,
            mode="RGB"
        )

        # Blend MRI + Grad-CAM
        base_array = np.asarray(
            original_rgb
        ).astype(
            np.float32
        )

        heatmap_array = np.asarray(
            heatmap
        ).astype(
            np.float32
        )

        overlay = (
            0.55 * base_array
            + 0.45 * heatmap_array
        )

        overlay = np.clip(
            overlay,
            0,
            255
        ).astype(
            np.uint8
        )

        result = Image.fromarray(
            overlay,
            mode="RGB"
        )

        output_path.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        result.save(
            output_path
        )

        return {
            "predicted_class":
                CLASS_NAMES[
                    predicted_index
                ],

            "confidence":
                float(
                    probabilities[
                        predicted_index
                    ]
                ),

            "probabilities": {
                CLASS_NAMES[i]:
                    float(
                        probabilities[i]
                    )
                for i in range(
                    len(CLASS_NAMES)
                )
            },

            "path":
                str(output_path),
        }

    finally:

        gradcam.close()