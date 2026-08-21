from pathlib import Path
import json


BACKEND_DIR = Path(__file__).resolve().parents[1]
PROJECT_DIR = BACKEND_DIR.parent

MODEL_PATH = BACKEND_DIR / "models" / "neurovision_efficientnet_b0.pth"

CONFIG_PATH = BACKEND_DIR / "config" / "config.json"
LABELS_PATH = BACKEND_DIR / "config" / "labels.json"
PREPROCESSING_PATH = BACKEND_DIR / "config" / "preprocessing.json"


with open(CONFIG_PATH, "r", encoding="utf-8") as file:
    MODEL_CONFIG = json.load(file)

with open(LABELS_PATH, "r", encoding="utf-8") as file:
    LABEL_CONFIG = json.load(file)

with open(PREPROCESSING_PATH, "r", encoding="utf-8") as file:
    PREPROCESSING_CONFIG = json.load(file)


CLASS_NAMES = MODEL_CONFIG["classes"]

IMAGE_SIZE = tuple(
    MODEL_CONFIG["input"]["size"]
)

MEAN = MODEL_CONFIG["normalization"]["mean"]

STD = MODEL_CONFIG["normalization"]["std"]

XAI_TARGET_LAYER = MODEL_CONFIG["xai"]["target_layer"]