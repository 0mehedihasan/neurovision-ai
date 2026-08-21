
# NeuroVision AI

Three-class brain tumor MRI classification.

## Classes

1. Meningioma
2. Glioma
3. Pituitary

## Dataset

BrainTumorDataPublic

Total samples: 3,064

Unique patients: 233

## Patient-level split

Test fold: 5

Training samples: 1,947

Validation samples: 474

Test samples: 643

## Model

EfficientNet-B0

Parameters: 4,011,391

Input: 224 x 224

Input channels: 3

MRI source: grayscale

Conversion: grayscale -> RGB

## Training

Configured epochs: 50

Completed epochs: 15

Best epoch: 8

Early stopping patience: 7

## Explainability

Grad-CAM

Target layer:

model.features[-1]

Tumor masks are used only for quantitative XAI localization evaluation.

## Best Validation F1

0.9629

## Test Metrics

- accuracy: 0.9114
- balanced_accuracy: 0.9095
- precision_macro: 0.8996
- recall_macro: 0.9095
- sensitivity_macro: 0.9095
- f1_macro: 0.9027
- f1_weighted: 0.9116
- mcc: 0.8662
- cohen_kappa: 0.8642
- specificity_macro: 0.9585
- roc_auc_ovr_macro: 0.9551
- pr_auc_macro: 0.9128


## ROC-AUC

Per-class ROC-AUC and macro ROC-AUC are stored in:

metrics/roc_auc_results.csv

## Export files

- neurovision_efficientnet_b0.pth
- neurovision_efficientnet_b0_checkpoint.pth
- config.json
- labels.json
- preprocessing.json
- inference.py
- requirements.txt

