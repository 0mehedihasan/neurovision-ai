import {
  Database,
  Users,
  Scale,
  Layers,
} from "lucide-react";

import FlowDiagram from "./FlowDiagram";

const PIPELINE_STEPS = [
  "Kaggle MRI Dataset",
  "BrainTumorDataPublic",
  "MAT/HDF5 Extraction",
  "Manifest Construction",
  "Patient-Level Partitioning",
  "MRI Preprocessing",
  "Class Balancing",
  "Data Augmentation",
  "EfficientNet-B0 Training",
  "Validation & Checkpoint Selection",
  "Test Evaluation",
  "Grad-CAM Explainability",
  "Tumor Mask Localization Evaluation",
  "Model Export",
  "FastAPI Inference",
  "Vercel + Render Deployment",
];

const PREPROCESSING_STEPS = [
  "Raw MRI",
  "NaN / Inf Handling",
  "1st–99th Percentile Normalization",
  "0–255 Scaling",
  "Grayscale",
  "3-Channel Conversion",
  "224 × 224 Resize",
  "ImageNet Normalization",
];

function Methodology() {
  return (
    <section className="methodology-section">
      <div className="section-label">METHODOLOGY</div>

      <h2>Research methodology</h2>

      <p className="section-description">
        From raw MRI data to explainable tumor classification.
      </p>

      <div className="methodology-flow-card">
        <FlowDiagram steps={PIPELINE_STEPS} compact />
      </div>

      <div className="methodology-grid">
        <article className="methodology-card">
          <div className="methodology-card-icon">
            <Database size={20} />
          </div>

          <h3>Dataset</h3>

          <div className="methodology-stat-row">
            <div>
              <strong>3,064</strong>
              <span>MAT samples</span>
            </div>

            <div>
              <strong>233</strong>
              <span>Patients</span>
            </div>

            <div>
              <strong>3</strong>
              <span>Classes</span>
            </div>
          </div>

          <p>
            Each MAT sample stores an image, a class label, a
            patient ID, a tumor mask, and a tumor border under a{" "}
            <code>cjdata</code> structure. The MRI image is used
            for classification. The tumor mask is not fed into
            the classifier — it is used independently to
            evaluate Grad-CAM localization.
          </p>
        </article>

        <article className="methodology-card">
          <div className="methodology-card-icon">
            <Users size={20} />
          </div>

          <h3>Patient-Level Leakage Prevention</h3>

          <div className="split-disjoint">
            <span>Train ∩ Validation = ∅</span>
            <span>Train ∩ Test = ∅</span>
            <span>Validation ∩ Test = ∅</span>
          </div>

          <p>
            MRI samples from the same patient are constrained to
            a single partition. The pipeline uses 5 predefined
            folds from <code>cvind.mat</code>, with fold 5 held
            out as the test set and the remaining folds used for
            training and validation.
          </p>
        </article>

        <article className="methodology-card">
          <div className="methodology-card-icon">
            <Scale size={20} />
          </div>

          <h3>Class Imbalance Handling</h3>

          <p>
            Class weights are derived from the training
            distribution and passed into a weighted, label-smoothed
            objective:
          </p>

          <pre className="methodology-code">
{`weight_c = N / (K × N_c)

CrossEntropyLoss(
  weight=class_weights,
  label_smoothing=0.05
)`}
          </pre>
        </article>
      </div>

      <div className="preprocessing-block">
        <div className="preprocessing-block-heading">
          <Layers size={18} />
          <div>
            <h3>Preprocessing pipeline</h3>
            <p>
              Validation and test preprocessing is deterministic.
              Training additionally applies random horizontal
              flip, random rotation (±10°), and color jitter.
            </p>
          </div>
        </div>

        <FlowDiagram steps={PREPROCESSING_STEPS} compact />
      </div>
    </section>
  );
}

export default Methodology;
