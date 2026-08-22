from pathlib import Path
from uuid import uuid4

from fastapi import (
    FastAPI,
    File,
    HTTPException,
    UploadFile,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.config import (
    CLASS_NAMES,
    IMAGE_SIZE,
    MEAN,
    STD,
    MODEL_CONFIG,
    XAI_TARGET_LAYER,
)

from app.schemas import (
    HealthResponse,
    ModelInfoResponse,
    PredictionResponse,
)

from app.services.model_service import (
    model_service,
)

from app.services.prediction import (
    predict_image,
)

from app.services.gradcam import (
    create_gradcam,
)

from app.utils.image_utils import (
    ALLOWED_IMAGE_TYPES,
    ALLOWED_EXTENSIONS,
    load_image,
)


# =============================================================================
# PATHS
# =============================================================================

BASE_DIR = Path(
    __file__
).resolve().parents[2]

XAI_OUTPUT_DIR = (
    BASE_DIR
    / "assets"
    / "generated"
)

XAI_OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =============================================================================
# APPLICATION
# =============================================================================

app = FastAPI(
    title="NeuroVision AI",
    description=(
        "Brain tumor classification "
        "and Grad-CAM explainability API"
    ),
    version="1.0.0",
)


# =============================================================================
# CORS
# =============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://neurovision-ai-ten.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# HELPERS
# =============================================================================

def validate_upload(
    file: UploadFile,
) -> str:
    """
    Validate an uploaded file.

    Supported formats:

    MAT
    PNG
    JPG
    JPEG
    WEBP

    The file extension is authoritative for MAT files
    because browsers commonly send inconsistent MIME types.
    """

    filename = (
        file.filename or ""
    ).strip()

    if not filename:

        raise HTTPException(
            status_code=400,
            detail="Uploaded file has no filename.",
        )

    extension = Path(
        filename
    ).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file format. "
                "Use MAT, PNG, JPEG, JPG, or WEBP."
            ),
        )

    # MAT files can have application/octet-stream,
    # binary/octet-stream, or other MIME types.
    #
    # Therefore extension is sufficient for MAT.
    if extension == ".mat":

        return extension

    # For regular image files, also validate MIME type.
    if (
        file.content_type
        not in ALLOWED_IMAGE_TYPES
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid image MIME type. "
                "Use PNG, JPEG, JPG, or WEBP."
            ),
        )

    return extension


# =============================================================================
# SYSTEM
# =============================================================================

@app.get(
    "/",
    tags=["System"],
)
def root():

    return {
        "name": "NeuroVision AI",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["System"],
)
def health():

    return {
        "status": "healthy",
        "model": MODEL_CONFIG["model"],
        "device": str(
            model_service.device
        ),
        "classes": CLASS_NAMES,
    }


@app.get(
    "/model-info",
    response_model=ModelInfoResponse,
    tags=["System"],
)
def model_info():

    return {
        "model": MODEL_CONFIG["model"],
        "classes": CLASS_NAMES,
        "input_size": list(
            IMAGE_SIZE
        ),
        "channels": MODEL_CONFIG[
            "input"
        ]["channels"],
        "normalization_mean": MEAN,
        "normalization_std": STD,
        "xai_method": MODEL_CONFIG[
            "xai"
        ]["method"],
        "xai_target_layer":
            XAI_TARGET_LAYER,
    }


# =============================================================================
# PREDICTION
# =============================================================================

@app.post(
    "/predict",
    response_model=PredictionResponse,
    tags=["Prediction"],
)
async def predict(
    file: UploadFile = File(...),
):

    extension = validate_upload(
        file
    )

    try:

        image_bytes = (
            await file.read()
        )

        if not image_bytes:

            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty.",
            )

        # image_utils.py accepts:
        #
        # load_image(
        #     image_bytes,
        #     filename
        # )
        #
        # It automatically handles MAT versus
        # PNG/JPG/WEBP based on the extension.

        image = load_image(
            image_bytes,
            filename=file.filename,
        )

        result = predict_image(
            image
        )

        return result

    except HTTPException:
        raise

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Prediction failed: {exc}"
            ),
        ) from exc


# =============================================================================
# GRAD-CAM EXPLAINABILITY
# =============================================================================

@app.post(
    "/explain",
    tags=["Explainability"],
)
async def explain(
    file: UploadFile = File(...),
):

    validate_upload(
        file
    )

    try:

        image_bytes = (
            await file.read()
        )

        if not image_bytes:

            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty.",
            )

        image = load_image(
            image_bytes,
            filename=file.filename,
        )

        filename = (
            f"gradcam_{uuid4().hex}.png"
        )

        output_path = (
            XAI_OUTPUT_DIR
            / filename
        )

        result = create_gradcam(
            image,
            output_path,
        )

        return {
            "predicted_class":
                result[
                    "predicted_class"
                ],

            "confidence":
                result[
                    "confidence"
                ],

            "probabilities":
                result.get(
                    "probabilities",
                    {},
                ),

            "gradcam_url":
                f"/gradcam/{filename}",
        }

    except HTTPException:
        raise

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Grad-CAM failed: {exc}"
            ),
        ) from exc


# =============================================================================
# GRAD-CAM FILE
# =============================================================================

@app.get(
    "/gradcam/{filename}",
    tags=["Explainability"],
)
def get_gradcam(
    filename: str,
):

    # Prevent path traversal.
    safe_name = Path(
        filename
    ).name

    if safe_name != filename:

        raise HTTPException(
            status_code=400,
            detail="Invalid filename.",
        )

    # Only generated PNG files are served.
    if Path(
        safe_name
    ).suffix.lower() != ".png":

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid Grad-CAM filename."
            ),
        )

    file_path = (
        XAI_OUTPUT_DIR
        / safe_name
    )

    if not file_path.is_file():

        raise HTTPException(
            status_code=404,
            detail=(
                "Grad-CAM image not found."
            ),
        )

    return FileResponse(
        path=file_path,
        media_type="image/png",
        filename=safe_name,
    )