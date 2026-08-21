from PIL import Image

from app.config import CLASS_NAMES
from app.services.model_service import model_service
from app.services.preprocessing import preprocess_image


def predict_image(
    image: Image.Image
):
    """
    Run NeuroVision AI brain tumor classification.

    Input:
        PIL.Image.Image

    Output:
        predicted_class
        confidence
        class probabilities
    """

    if not isinstance(
        image,
        Image.Image
    ):
        raise TypeError(
            "image must be a PIL.Image.Image"
        )

    tensor = preprocess_image(
        image
    )

    _, probabilities = (
        model_service.predict_tensor(
            tensor
        )
    )

    probabilities = (
        probabilities[0]
        .detach()
        .cpu()
        .numpy()
    )

    if len(probabilities) != len(
        CLASS_NAMES
    ):
        raise RuntimeError(
            "Model output does not match "
            "the configured class labels."
        )

    predicted_index = int(
        probabilities.argmax()
    )

    predicted_class = (
        CLASS_NAMES[
            predicted_index
        ]
    )

    confidence = float(
        probabilities[
            predicted_index
        ]
    )

    probability_dict = {
        CLASS_NAMES[index]: float(
            probabilities[index]
        )
        for index in range(
            len(CLASS_NAMES)
        )
    }

    return {
        "predicted_class":
            predicted_class,

        "confidence":
            confidence,

        "probabilities":
            probability_dict,
    }