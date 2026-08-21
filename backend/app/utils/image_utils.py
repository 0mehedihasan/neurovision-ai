from io import BytesIO
from pathlib import Path

import h5py
import numpy as np
from PIL import Image


ALLOWED_IMAGE_TYPES = {
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
}

ALLOWED_EXTENSIONS = {
    ".mat",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
}


def load_image(
    image_bytes: bytes,
    filename: str = "",
    content_type: str = "",
) -> Image.Image:
    """
    Load an uploaded image.

    Supports:
        PNG
        JPEG
        JPG
        WEBP
        MATLAB MAT v7.3
    """

    extension = Path(filename or "").suffix.lower()

    if extension == ".mat":
        return load_mat_image(image_bytes)

    try:
        image = Image.open(BytesIO(image_bytes))
        image.load()
        return image.convert("RGB")

    except Exception as exc:
        raise ValueError(
            "Invalid or corrupted image file."
        ) from exc


def load_mat_image(
    image_bytes: bytes,
) -> Image.Image:
    """
    Load MATLAB v7.3 MAT files.

    MATLAB v7.3 files use HDF5 internally, so h5py
    is required instead of scipy.io.loadmat().
    """

    try:
        with h5py.File(
            BytesIO(image_bytes),
            "r",
        ) as mat:

            image_array = _find_mat_image(mat)

    except OSError as exc:
        raise ValueError(
            "Unable to read MAT file. "
            "The file may not be a valid MATLAB v7.3 file."
        ) from exc

    except ValueError:
        raise

    except Exception as exc:
        raise ValueError(
            "Unable to extract image data from MAT file."
        ) from exc

    image_array = np.asarray(
        image_array
    )

    image_array = np.squeeze(
        image_array
    )

    if image_array.ndim != 2:

        raise ValueError(
            f"Expected a 2D MRI image, "
            f"got shape {image_array.shape}."
        )

    image_array = image_array.astype(
        np.float32
    )

    finite_mask = np.isfinite(
        image_array
    )

    if not finite_mask.any():

        raise ValueError(
            "MAT image contains no valid pixel values."
        )

    valid_values = image_array[
        finite_mask
    ]

    low = float(
        np.percentile(
            valid_values,
            1,
        )
    )

    high = float(
        np.percentile(
            valid_values,
            99,
        )
    )

    if high <= low:

        low = float(
            valid_values.min()
        )

        high = float(
            valid_values.max()
        )

    image_array = np.clip(
        image_array,
        low,
        high,
    )

    if high > low:

        image_array = (
            image_array - low
        ) / (
            high - low
        )

    else:

        image_array = np.zeros_like(
            image_array
        )

    image_array = (
        image_array * 255.0
    ).astype(
        np.uint8
    )

    return Image.fromarray(
        image_array,
        mode="L",
    ).convert("RGB")


def _find_mat_image(
    h5_file: h5py.File,
) -> np.ndarray:
    """
    Find the actual 2D image dataset inside an HDF5/MAT v7.3 file.

    Handles both simple datasets and nested MATLAB structures.
    """

    candidates = []

    def visit(
        name: str,
        obj,
    ):

        if not isinstance(
            obj,
            h5py.Dataset,
        ):
            return

        shape = obj.shape

        if not shape:
            return

        dtype = obj.dtype

        # Ignore MATLAB metadata/reference datasets.
        if (
            h5py.check_dtype(
                ref=dtype
            ) is not None
        ):
            return

        if not np.issubdtype(
            dtype,
            np.number,
        ):
            return

        squeezed_shape = tuple(
            dim
            for dim in shape
            if dim != 1
        )

        if len(squeezed_shape) != 2:
            return

        height, width = squeezed_shape

        if height < 32 or width < 32:
            return

        candidates.append(
            (
                name,
                obj,
                int(
                    np.prod(
                        shape
                    )
                ),
            )
        )

    h5_file.visititems(
        visit
    )

    if not candidates:

        raise ValueError(
            "No 2D numeric image dataset "
            "was found inside the MAT v7.3 file."
        )

    # Prefer common image field names.
    preferred_names = (
        "image",
        "img",
        "cjdata/image",
        "cjdata",
    )

    for preferred in preferred_names:

        for name, dataset, _ in candidates:

            if (
                name.lower()
                .endswith(
                    preferred.lower()
                )
            ):

                return np.array(
                    dataset
                )

    # Otherwise select the largest 2D numeric dataset.
    _, dataset, _ = max(
        candidates,
        key=lambda item: item[2],
    )

    return np.array(
        dataset
    )
