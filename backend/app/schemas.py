from typing import Dict

from pydantic import BaseModel, Field


class PredictionResponse(BaseModel):
    predicted_class: str
    confidence: float = Field(ge=0.0, le=1.0)
    probabilities: Dict[str, float]


class HealthResponse(BaseModel):
    status: str
    model: str
    device: str
    classes: list[str]


class ModelInfoResponse(BaseModel):
    model: str
    classes: list[str]
    input_size: list[int]
    channels: int
    normalization_mean: list[float]
    normalization_std: list[float]
    xai_method: str
    xai_target_layer: str