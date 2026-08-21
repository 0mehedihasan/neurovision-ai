from pathlib import Path

import torch
from torchvision import models

from app.config import CLASS_NAMES, MODEL_PATH


class ModelService:

    def __init__(self):

        self.device = torch.device(
            "cuda"
            if torch.cuda.is_available()
            else "cpu"
        )

        self.model = self._load_model()

    def _load_model(self):

        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model not found: {MODEL_PATH}"
            )

        # Exact architecture used during training.
        model = models.efficientnet_b0(
            weights=None
        )

        model.classifier[1] = (
            torch.nn.Linear(
                model.classifier[1].in_features,
                len(CLASS_NAMES),
            )
        )

        state_dict = torch.load(
            MODEL_PATH,
            map_location=self.device,
            weights_only=True,
        )

        if not isinstance(
            state_dict,
            dict,
        ):
            raise RuntimeError(
                "Invalid model checkpoint format."
            )

        model.load_state_dict(
            state_dict,
            strict=True,
        )

        model = model.to(
            self.device
        )

        model.eval()

        return model

    def predict_tensor(
        self,
        tensor: torch.Tensor,
    ):

        if not isinstance(
            tensor,
            torch.Tensor,
        ):
            raise TypeError(
                "tensor must be a torch.Tensor."
            )

        if tensor.ndim != 4:
            raise ValueError(
                "Expected input shape "
                "(batch, channels, height, width). "
                f"Received {tuple(tensor.shape)}."
            )

        if tensor.shape[1:] != (
            3,
            224,
            224,
        ):
            raise ValueError(
                "Expected input shape "
                "(batch, 3, 224, 224). "
                f"Received {tuple(tensor.shape)}."
            )

        tensor = tensor.to(
            self.device
        )

        with torch.no_grad():

            logits = self.model(
                tensor
            )

            probabilities = torch.softmax(
                logits,
                dim=1,
            )

        return (
            logits,
            probabilities,
        )


model_service = ModelService()