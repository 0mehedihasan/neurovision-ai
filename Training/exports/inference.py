
import json

import numpy as np

import torch

from PIL import Image

from torchvision import models, transforms


MODEL_PATH = (
    "neurovision_efficientnet_b0.pth"
)

CONFIG_PATH = (
    "config.json"
)


with open(
    CONFIG_PATH,
    "r",
    encoding="utf-8"
) as file:

    config = json.load(file)


CLASS_NAMES = config["classes"]

IMAGE_SIZE = (
    config["input"]["size"][0]
)

MEAN = config["normalization"]["mean"]

STD = config["normalization"]["std"]


DEVICE = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)


model = models.efficientnet_b0(
    weights=None
)


model.classifier[1] = (
    torch.nn.Linear(
        model.classifier[1].in_features,
        len(CLASS_NAMES)
    )
)


state_dict = torch.load(
    MODEL_PATH,
    map_location=DEVICE,
    weights_only=True
)


model.load_state_dict(
    state_dict
)


model = model.to(DEVICE)

model.eval()


transform = transforms.Compose([

    transforms.Grayscale(
        num_output_channels=3
    ),

    transforms.Resize(
        (
            IMAGE_SIZE,
            IMAGE_SIZE
        )
    ),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=MEAN,
        std=STD
    ),

])


def predict(image):

    if not isinstance(
        image,
        Image.Image
    ):

        image = Image.fromarray(
            np.asarray(image)
        )


    image = image.convert("L")


    tensor = (
        transform(image)
        .unsqueeze(0)
        .to(DEVICE)
    )


    with torch.no_grad():

        logits = model(tensor)

        probabilities = (
            torch.softmax(
                logits,
                dim=1
            )[0]
        )


    predicted_index = int(
        probabilities.argmax()
    )


    return {

        "class":
            CLASS_NAMES[
                predicted_index
            ],

        "confidence":
            float(
                probabilities[
                    predicted_index
                ]
            ),

        "probabilities":
            {
                CLASS_NAMES[i]:
                    float(
                        probabilities[i]
                    )
                for i in range(
                    len(CLASS_NAMES)
                )
            },

    }
