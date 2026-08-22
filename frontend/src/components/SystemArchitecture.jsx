import { ScanSearch, Network } from "lucide-react";

import FlowDiagram from "./FlowDiagram";
import BranchFlow from "./BranchFlow";

const INFERENCE_STEPS = [
  "User",
  "Vercel Frontend (React + Vite)",
  "Render Backend (FastAPI)",
  "Model Loader",
  "EfficientNet-B0",
];

const GRADCAM_STEPS = [
  "MRI",
  "EfficientNet-B0",
  "Predicted Class",
  "Target Layer: model.features[-1]",
  "Gradient Computation",
  "Grad-CAM",
  "Activation Heatmap",
  "Tumor Mask Comparison",
  "Localization Metrics",
];

const LOCALIZATION_METRICS = [
  "CAM IoU",
  "CAM Precision",
  "CAM Recall",
  "CAM Area Ratio",
];

const RESULTS = [
  ["91.14%", "Accuracy"],
  ["90.95%", "Balanced Accuracy"],
  ["90.27%", "Macro F1"],
  ["0.8662", "MCC"],
  ["95.51%", "Macro ROC AUC"],
  ["91.28%", "Macro PR AUC"],
];

const WORKFLOW = [
  ["01", "Dataset"],
  ["02", "Preprocessing"],
  ["03", "Splitting"],
  ["04", "Training"],
  ["05", "Evaluation"],
  ["06", "Explainability"],
  ["07", "Deployment"],
];

function SystemArchitecture() {
  return (
    <section className="system-architecture-section">
      <div className="section-label">HOW NEUROVISION AI WORKS</div>

      <h2>From research pipeline to deployed application</h2>

      <p className="section-description">
        The same EfficientNet-B0 checkpoint produced during
        training is what the deployed backend loads for
        inference.
      </p>

      <div className="architecture-block">
        <div className="architecture-block-heading">
          <Network size={18} />
          <div>
            <h3>Inference architecture</h3>
            <p>
              The frontend handles upload and visualization; the
              Render backend performs all Python inference.
            </p>
          </div>
        </div>

        <div className="architecture-diagram">
          <FlowDiagram steps={INFERENCE_STEPS} compact />

          <BranchFlow
            trunk="EfficientNet-B0 Output"
            branches={[
              {
                title: "Prediction",
                text: "Class + probabilities",
              },
              {
                title: "Grad-CAM",
                text: "Heatmap (local workflow)",
              },
            ]}
          />
        </div>

        <p className="architecture-note">
          The prediction response contains the predicted class,
          confidence, and per-class probabilities. Grad-CAM
          provides the explainability pathway where it is wired
          into the running workflow.
        </p>
      </div>

      <div className="architecture-block">
        <div className="architecture-block-heading">
          <ScanSearch size={18} />
          <div>
            <h3>Grad-CAM architecture</h3>
            <p>
              Ground-truth tumor masks are used independently to
              evaluate whether the model's highlighted regions
              correspond to annotated tumor regions — they are
              never fed into EfficientNet-B0 during
              classification.
            </p>
          </div>
        </div>

        <div className="architecture-diagram">
          <FlowDiagram steps={GRADCAM_STEPS} compact />
        </div>

        <div className="localization-metric-row">
          {LOCALIZATION_METRICS.map((metric) => (
            <span className="localization-metric-pill" key={metric}>
              {metric}
            </span>
          ))}
        </div>
      </div>

      <div className="results-summary-card">
        <h3>Research results</h3>

        <div className="results-summary-grid">
          {RESULTS.map(([value, label]) => (
            <div className="results-summary-item" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <p>
          The full test-set breakdown, including class-level
          precision, recall, and ROC AUC, is available on the{" "}
          <a href="/documentation#results">Documentation</a> page.
        </p>
      </div>

      <div className="project-workflow-numbered">
        {WORKFLOW.map(([number, label]) => (
          <div className="project-workflow-numbered-item" key={number}>
            <span>{number}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SystemArchitecture;
