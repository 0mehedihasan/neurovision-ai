from PIL import Image
from torchvision import transforms

from app.config import IMAGE_SIZE, MEAN, STD


_transform = transforms.Compose(
    [
        transforms.Grayscale(
            num_output_channels=3
        ),
        transforms.Resize(
            IMAGE_SIZE
        ),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=MEAN,
            std=STD
        ),
    ]
)


def preprocess_image(
    image: Image.Image
):
    """
    Apply the exact preprocessing used during model inference.

    Input:
        Grayscale MRI image

    Pipeline:
        Grayscale
        -> 3 channels
        -> 224 x 224
        -> Tensor
        -> ImageNet normalization

    Output:
        Tensor with shape (1, 3, 224, 224)
    """

    if not isinstance(
        image,
        Image.Image
    ):
        raise TypeError(
            "image must be a PIL.Image.Image"
        )

    image = image.convert("L")

    tensor = _transform(image)

    return tensor.unsqueeze(0)