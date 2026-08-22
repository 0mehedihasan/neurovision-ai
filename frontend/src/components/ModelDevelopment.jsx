import { Cpu } from "lucide-react";

import FlowDiagram from "./FlowDiagram";
import BranchFlow from "./BranchFlow";

const DEV_FLOW_STEPS = [
  "MRI Dataset",
  "Patient-Level Split",
  "Training Set",
  "EfficientNet-B0",
  "Validation Macro F1",
  "Best Checkpoint",
  "Held-Out Test Set",
  "Final Metrics",
];

const ARCHITECTURE_STEPS = [
  "MRI Input (224 × 224 × 3)",
  "ImageNet Preprocessing",
  "EfficientNet-B0 (ImageNet Pretrained)",
  "Feature Extraction",
  "Modified Classifier",
  "3 Logits",
  "Softmax",
];

const TRAINING_CONFIG = [
  ["Architecture", "EfficientNet-B0"],
  ["Input", "224 × 224 × 3"],
  ["Pretrained", "ImageNet"],
  ["Batch Size", "16"],
  ["Maximum Epochs", "50"],
  ["Optimizer", "AdamW"],
  ["Learning Rate", "1e-4"],
  ["Weight Decay", "1e-4"],
  ["Label Smoothing", "0.05"],
  ["Gradient Clipping", "1.0"],
  ["Early Stopping", "7 epochs"],
  ["Selection Metric", "Validation Macro F1"],
  ["Seed", "42"],
];

function ModelDevelopment() {
  return (
    <section className="model-dev-section">
      <div className="section-label">MODEL DEVELOPMENT</div>

      <h2>How the model was trained</h2>

      <p className="section-description">
        A patient-level split feeds a held-out test set that never
        influences training or checkpoint selection.
      </p>

      <div className="model-dev-flow-card">
        <FlowDiagram steps={DEV_FLOW_STEPS} compact />
      </div>

      <div className="training-budget-callout">
        <div>
          <span>Configured epochs</span>
          <strong>50</strong>
        </div>

        <div>
          <span>Completed epochs</span>
          <strong>15</strong>
        </div>

        <div>
          <span>Best epoch</span>
          <strong>8</strong>
        </div>

        <div>
          <span>Best val. Macro F1</span>
          <strong>0.9629</strong>
        </div>
      </div>

      <p className="training-budget-note">
        The model was configured for a maximum of 50 epochs, but
        early stopping halted training at epoch 15 once no
        further improvement was seen after the best checkpoint at
        epoch 8.
      </p>

      <div className="training-config-card">
        <h3>Training configuration</h3>

        <div className="training-config-grid">
          {TRAINING_CONFIG.map(([label, value]) => (
            <div className="training-config-item" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="architecture-block">
        <div className="architecture-block-heading">
          <Cpu size={18} />
          <div>
            <h3>Model architecture</h3>
            <p>
              The original EfficientNet-B0 classifier is replaced
              with a three-output classification layer.
            </p>
          </div>
        </div>

        <div className="architecture-diagram">
          <FlowDiagram steps={ARCHITECTURE_STEPS} compact />

          <BranchFlow
            trunk="Softmax Probabilities"
            branches={[
              { title: "Meningioma", text: "Class 1" },
              { title: "Glioma", text: "Class 2" },
              { title: "Pituitary", text: "Class 3" },
            ]}
          />
        </div>
      </div>
    </section>
  );
}

export default ModelDevelopment;
