# NeuroVision AI

An explainable AI system for three-class brain tumor MRI classification using **EfficientNet-B0** and **Grad-CAM**.

NeuroVision AI classifies brain MRI samples into **Meningioma, Glioma, and Pituitary** tumor categories and provides probability estimates together with Grad-CAM based visual explanations.

## Overview

NeuroVision AI is a research and demonstration system designed to explore deep learning based brain tumor classification with patient-level data partitioning and explainable AI.

The system combines:

* EfficientNet-B0 with ImageNet pretrained weights
* Patient-level train, validation, and test partitioning
* MRI intensity normalization and preprocessing
* Class-balanced training
* Early stopping and validation Macro F1 checkpoint selection
* Grad-CAM explainability
* Tumor-mask based localization evaluation
* FastAPI inference backend
* React and Vite frontend
* Vercel frontend deployment
* Render backend deployment

## Task

The model performs three-class brain tumor classification:

| Label | Class      |
| ----: | ---------- |
|     1 | Meningioma |
|     2 | Glioma     |
|     3 | Pituitary  |

The system is specifically designed for these three categories and should not be interpreted as a general classifier for all brain tumor types.

## Dataset

The project uses the **BrainTumorDataPublic** component of a broader Kaggle MRI dataset collection.

The broader Kaggle package contains multiple dataset components. NeuroVision AI uses the `BrainTumorDataPublic` component for the classifier.

The classifier dataset contains:

* **3,064 MRI samples**
* **233 unique patients**
* **1,947 training samples**
* **474 validation samples**
* **643 test samples**

The data are stored as MATLAB `.mat` files containing a `cjdata` structure:

```text
cjdata
├── image
├── label
├── PID
├── tumorMask
└── tumorBorder
```

The available fields provide:

* MRI image
* Tumor class
* Patient ID
* Tumor segmentation mask
* Tumor border

The tumor mask is not used as classifier input. It is used independently for quantitative Grad-CAM localization evaluation.

## Patient-Level Data Splitting

The dataset is partitioned at the patient level to reduce the risk of data leakage between training, validation, and test sets.

The final experiment contains:

| Partition  | Samples | Patients |
| ---------- | ------: | -------: |
| Training   |   1,947 |      148 |
| Validation |     474 |       38 |
| Test       |     643 |       47 |

The experiment uses **fold 5 as the held-out test fold**.

MRI samples belonging to the same patient are constrained to a single partition.

The pipeline verifies patient-set separation between the partitions to prevent patient-level leakage.

## Preprocessing

The preprocessing pipeline consists of:

```text
Raw MRI
   ↓
NaN / Inf handling
   ↓
1st to 99th percentile intensity normalization
   ↓
0 to 255 scaling
   ↓
Grayscale to RGB conversion
   ↓
224 × 224 resizing
   ↓
ImageNet normalization
```

ImageNet normalization uses:

```text
Mean = [0.485, 0.456, 0.406]
Std  = [0.229, 0.224, 0.225]
```

Training additionally applies data augmentation, while validation and test preprocessing remain deterministic.

## Class Balancing

Class imbalance is addressed using class weights calculated from the training distribution.

The weighted classification objective uses:

```text
CrossEntropyLoss
```

with class weights and label smoothing.

Label smoothing is configured as:

```text
0.05
```

This allows the training objective to account for class imbalance while reducing overconfident target assignments.

## Model

NeuroVision AI uses an **ImageNet-pretrained EfficientNet-B0** backbone.

```text
MRI
224 × 224 × 3
       │
       ▼
EfficientNet-B0
ImageNet pretrained
       │
       ▼
Modified classifier
       │
       ▼
3 output classes
       │
       ▼
Softmax probabilities
```

Model configuration:

| Parameter            | Value           |
| -------------------- | --------------- |
| Architecture         | EfficientNet-B0 |
| Parameters           | 4,011,391       |
| Trainable parameters | 4,011,391       |
| Input size           | 224 × 224       |
| Input channels       | 3               |
| Source image         | Grayscale MRI   |
| Conversion           | Grayscale → RGB |
| Output classes       | 3               |

The original classifier is replaced with a three-class output layer.

## Training

The final experiment used:

| Parameter               | Value               |
| ----------------------- | ------------------- |
| Architecture            | EfficientNet-B0     |
| Batch size              | 16                  |
| Maximum epochs          | 50                  |
| Learning rate           | 1e-4                |
| Weight decay            | 1e-4                |
| Optimizer               | AdamW               |
| Label smoothing         | 0.05                |
| Early stopping patience | 7                   |
| Selection metric        | Validation Macro F1 |
| Random seed             | 42                  |

The model was configured for a maximum of 50 epochs but stopped early.

```text
Configured epochs : 50
Completed epochs  : 15
Best epoch        : 8
Best Val Macro F1 : 0.9629
```

The best checkpoint was selected according to validation Macro F1.

## Test Performance

The final test set contains **643 samples**.

| Metric            |      Score |
| ----------------- | ---------: |
| Accuracy          | **91.14%** |
| Balanced Accuracy | **90.95%** |
| Macro Precision   | **89.96%** |
| Macro Recall      | **90.95%** |
| Macro F1          | **90.27%** |
| Weighted F1       | **91.16%** |
| MCC               | **0.8662** |
| Cohen's Kappa     | **0.8642** |
| Macro Specificity | **95.85%** |
| Macro ROC AUC     | **95.51%** |
| Macro PR AUC      | **91.28%** |

### Class-Level Performance

| Class      | Precision | Recall |     F1 |
| ---------- | --------: | -----: | -----: |
| Meningioma |    83.13% | 83.13% | 83.13% |
| Glioma     |    98.85% | 90.24% | 94.35% |
| Pituitary  |    87.91% | 99.47% | 93.33% |

### ROC AUC

| Class      |    ROC AUC |
| ---------- | ---------: |
| Meningioma |     0.9085 |
| Glioma     |     0.9843 |
| Pituitary  |     0.9725 |
| Macro      | **0.9551** |

## Explainable AI

NeuroVision AI uses **Grad-CAM** to visualize image regions contributing to the predicted class.

The configured target layer is:

```text
model.features[-1]
```

The explainability workflow is:

```text
MRI
 ↓
EfficientNet-B0
 ↓
Predicted class
 ↓
Gradient computation
 ↓
Grad-CAM
 ↓
Activation heatmap
 ↓
Tumor-mask comparison
```

Ground-truth tumor masks are used independently to evaluate the spatial relationship between the Grad-CAM activation and the annotated tumor region.

The localization evaluation includes:

* CAM IoU
* CAM Precision
* CAM Recall
* CAM Area Ratio

Grad-CAM activation is thresholded using the activation distribution before localization comparison.

## Project Workflow

```text
Kaggle MRI Dataset
        │
        ▼
BrainTumorDataPublic
        │
        ▼
MAT / HDF5 Extraction
        │
        ▼
Manifest Construction
        │
        ▼
Patient-Level Partitioning
        │
        ├──────────────┬──────────────┐
        ▼              ▼              ▼
      Train          Validation       Test
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                MRI Preprocessing
                       │
                       ▼
                 Class Balancing
                       │
                       ▼
                 EfficientNet-B0
                       │
                       ▼
                  Model Training
                       │
                       ▼
                 Best Checkpoint
                       │
                       ▼
                  Test Evaluation
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
      Classification            XAI
             │                   │
             ▼                   ▼
      Probability Output       Grad-CAM
                                 │
                                 ▼
                         Tumor Mask Comparison
                                 │
                                 ▼
                       Localization Evaluation
```

## Repository Structure

```text
neurovision-ai/
│
├── Training/
│   ├── exports/
│   ├── figures/
│   ├── manifest/
│   ├── metrics/
│   ├── notebook/
│   └── xai/
│
├── backend/
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── schemas.py
│       ├── services/
│       └── utils/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

## Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/0mehedihasan/neurovision-ai.git
cd neurovision-ai
```

### 2. Backend

```bash
cd backend

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend

Open another terminal:

```bash
cd frontend

npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## API

The FastAPI backend provides:

| Method | Endpoint              | Description                   |
| ------ | --------------------- | ----------------------------- |
| GET    | `/`                   | API status                    |
| GET    | `/health`             | Backend and model health      |
| GET    | `/model-info`         | Model configuration           |
| POST   | `/predict`            | MRI classification            |
| POST   | `/explain`            | Generate Grad-CAM explanation |
| GET    | `/gradcam/{filename}` | Retrieve generated Grad-CAM   |

Supported prediction uploads include:

```text
MAT
PNG
JPG
JPEG
WEBP
```

### Prediction Response

```json
{
  "predicted_class": "Meningioma",
  "confidence": 0.9992,
  "probabilities": {
    "Meningioma": 0.9992,
    "Glioma": 0.00015,
    "Pituitary": 0.00063
  }
}
```

## Model Export

The trained model and inference configuration are stored under:

```text
Training/exports/
```

Key artifacts include:

```text
neurovision_efficientnet_b0.pth
config.json
labels.json
preprocessing.json
inference.py
requirements.txt
```

The exported configuration preserves the model architecture, class mapping, preprocessing configuration, and Grad-CAM target layer.

## Deployment Architecture

NeuroVision AI uses a separated frontend and backend deployment architecture.

```text
                         USER
                           │
                           ▼
                Vercel Frontend
             React + Vite Application
                           │
                           │ HTTPS API Requests
                           ▼
                 Render Backend
                 FastAPI Application
                           │
                           ▼
                 EfficientNet-B0
                  Model Inference
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
        Classification               Grad-CAM
             │                           │
             └─────────────┬─────────────┘
                           ▼
                    JSON / Image Response
                           │
                           ▼
                    Vercel Frontend
                           │
                           ▼
                         USER
```

### Frontend Deployment

The frontend is a **React + Vite** application deployed on **Vercel**.

Production frontend:

https://neurovision-ai-ten.vercel.app/

The frontend is responsible for:

* MRI file upload
* User interface and navigation
* Sending inference requests to the backend
* Displaying predicted class
* Displaying confidence and class probabilities
* Displaying analysis errors
* Rendering project documentation
* Displaying Grad-CAM results when available

The frontend does not perform model inference locally.

Instead, it communicates with the deployed FastAPI backend through HTTPS API requests.

### Backend Deployment

The backend is a **FastAPI** application deployed separately on **Render**.

The backend is responsible for:

* Loading the exported EfficientNet-B0 model
* Loading the saved preprocessing configuration
* Processing uploaded MRI files
* Performing model inference
* Returning class probabilities
* Generating Grad-CAM explanations
* Serving generated Grad-CAM images
* Providing health and model-information endpoints

The production backend exposes:

```text
GET  /
GET  /health
GET  /model-info
POST /predict
POST /explain
GET  /gradcam/{filename}
```

### API Communication

The prediction flow is:

```text
1. User selects MRI
             │
             ▼
2. Vercel frontend
             │
             │ POST /predict
             ▼
3. Render FastAPI backend
             │
             ▼
4. File validation
             │
             ▼
5. MRI preprocessing
             │
             ▼
6. EfficientNet-B0 inference
             │
             ▼
7. Probability calculation
             │
             ▼
8. JSON response
             │
             ▼
9. Vercel frontend
             │
             ▼
10. Prediction displayed
```

### Grad-CAM Request Flow

```text
User MRI
   │
   ▼
Vercel Frontend
   │
   │ POST /explain
   ▼
Render FastAPI
   │
   ▼
EfficientNet-B0
   │
   ▼
Grad-CAM
   │
   ▼
Generated PNG
   │
   ▼
/gradcam/{filename}
   │
   ▼
Vercel Frontend
```

The backend generates the Grad-CAM visualization and returns a URL through which the generated image can be retrieved.

### CORS

Because the frontend and backend operate on different domains, the FastAPI backend enables CORS.

The production frontend origin is:

```text
https://neurovision-ai-ten.vercel.app
```

Local development origins are also supported:

```text
http://localhost:5173
http://127.0.0.1:5173
http://localhost:3000
http://127.0.0.1:3000
```

This allows the same API to support both local development and the deployed application.

### Production Architecture

```text
┌──────────────────────────────────────────┐
│                  Vercel                  │
│                                          │
│          React + Vite Frontend           │
│                                          │
│  Upload • Prediction • Results • XAI     │
└────────────────────┬─────────────────────┘
                     │
                     │ HTTPS
                     │ REST API
                     ▼
┌──────────────────────────────────────────┐
│                  Render                  │
│                                          │
│              FastAPI Backend             │
│                                          │
│  /predict • /explain • /health • /docs   │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│             EfficientNet-B0              │
│                                          │
│       MRI preprocessing + inference      │
│              + Grad-CAM                  │
└──────────────────────────────────────────┘
```

### Hosting Considerations

The backend is deployed as a hosted inference service rather than embedding the PyTorch model inside the Vercel frontend.

This separation provides:

* Vercel for frontend delivery
* Render for Python and PyTorch inference
* EfficientNet-B0 running on the backend
* HTTPS REST communication between frontend and backend
* Backend-based Grad-CAM generation

The hosted backend may experience cold-start latency depending on the hosting configuration and periods of inactivity.

## Limitations

NeuroVision AI is a research and demonstration system.

Important limitations include:

* The classifier is limited to three tumor categories.
* Performance is based on the evaluated BrainTumorDataPublic cohort.
* Model confidence should not be interpreted as clinical certainty.
* Grad-CAM provides model-attribution visualization rather than a clinical segmentation result.
* The system has not been established as a standalone clinical diagnostic device.
* Deployment performance can vary depending on hosting resources and cold-start conditions.

## Research Artifacts

The repository contains training and evaluation artifacts including:

```text
Training/
├── figures/
│   ├── confusion_matrix.png
│   ├── roc_curves.png
│   ├── training_accuracy.png
│   ├── training_auc.png
│   ├── training_f1.png
│   ├── training_loss.png
│   ├── training_sensitivity.png
│   └── training_specificity.png
│
├── metrics/
│   ├── classification_report.csv
│   ├── experiment_summary.json
│   ├── roc_auc_results.csv
│   ├── test_confusion_matrix.npy
│   ├── test_predictions.csv
│   └── training_history.csv
│
└── xai/
    └── Grad-CAM visualizations
```

## Research Scope

NeuroVision AI demonstrates an end-to-end explainable medical imaging workflow:

```text
Dataset
   ↓
Patient-Level Data Partitioning
   ↓
MRI Preprocessing
   ↓
Class-Balanced Training
   ↓
EfficientNet-B0
   ↓
Classification
   ↓
Grad-CAM
   ↓
Tumor-Mask Localization Evaluation
```

The project is intended to demonstrate how classification performance and model interpretability can be evaluated together within a reproducible research workflow.

## Disclaimer

NeuroVision AI is intended for research, educational, and demonstration purposes. It is not a substitute for professional medical diagnosis or clinical decision-making.

## License

No open-source license is currently specified for this repository.
