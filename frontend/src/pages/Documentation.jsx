import { useState } from "react";
import {
  BookOpen,
  Database,
  GitBranch,
  Cpu,
  FlaskConical,
  BarChart3,
  ScanSearch,
  Terminal,
  Code2,
  Cloud,
  AlertTriangle,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

const sections = [
  {
    id: "overview",
    label: "Overview",
    icon: BookOpen,
  },
  {
    id: "dataset",
    label: "Dataset",
    icon: Database,
  },
  {
    id: "methodology",
    label: "Methodology",
    icon: GitBranch,
  },
  {
    id: "model",
    label: "Model",
    icon: Cpu,
  },
  {
    id: "training",
    label: "Training",
    icon: FlaskConical,
  },
  {
    id: "results",
    label: "Results",
    icon: BarChart3,
  },
  {
    id: "xai",
    label: "Explainable AI",
    icon: ScanSearch,
  },
  {
    id: "workflow",
    label: "Workflow",
    icon: GitBranch,
  },
  {
    id: "installation",
    label: "Local Installation",
    icon: Terminal,
  },
  {
    id: "api",
    label: "API",
    icon: Code2,
  },
  {
    id: "deployment",
    label: "Deployment",
    icon: Cloud,
  },
  {
    id: "limitations",
    label: "Limitations",
    icon: AlertTriangle,
  },
];

function Documentation() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToSection = (id) => {
    setActiveSection(id);
    setMobileOpen(false);

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const active = sections.find(
    (section) => section.id === activeSection
  );

  return (
    <div className="documentation-page">
      <header className="documentation-header">
        <div className="container documentation-header-inner">
          <a href="/" className="documentation-brand">
            <span className="documentation-brand-mark">
              <Cpu size={20} />
            </span>

            <span>
              <strong>NeuroVision AI</strong>
              <small>Project Documentation</small>
            </span>
          </a>

          <a
            href="https://github.com/0mehedihasan/neurovision-ai"
            target="_blank"
            rel="noreferrer"
            className="documentation-github"
          >
            GitHub
            <ExternalLink size={15} />
          </a>
        </div>
      </header>

      <div className="container documentation-layout">
        <aside className="documentation-sidebar">
          <div className="documentation-sidebar-title">
            Documentation
          </div>

          <nav>
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <button
                  key={section.id}
                  className={
                    activeSection === section.id
                      ? "documentation-nav-item active"
                      : "documentation-nav-item"
                  }
                  onClick={() =>
                    scrollToSection(section.id)
                  }
                >
                  <Icon size={16} />
                  <span>{section.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="documentation-content">
          <div className="documentation-mobile-nav">
            <button
              onClick={() =>
                setMobileOpen((value) => !value)
              }
              className="documentation-mobile-trigger"
            >
              <span>
                {active?.label || "Documentation"}
              </span>

              <ChevronDown
                size={18}
                className={
                  mobileOpen ? "rotate" : ""
                }
              />
            </button>

            {mobileOpen && (
              <div className="documentation-mobile-menu">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() =>
                      scrollToSection(section.id)
                    }
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <section
            id="overview"
            className="documentation-section documentation-hero"
          >
            <div className="documentation-eyebrow">
              NEUROVISION AI · V1.0
            </div>

            <h1>
              Brain MRI classification
              <span> with explainable AI.</span>
            </h1>

            <p className="documentation-lead">
              NeuroVision AI is an AI-assisted brain MRI
              classification system built around an
              EfficientNet-B0 model for three brain tumor
              categories: Meningioma, Glioma, and
              Pituitary.
            </p>

            <div className="documentation-stat-grid">
              <div>
                <strong>3</strong>
                <span>Tumor classes</span>
              </div>

              <div>
                <strong>224²</strong>
                <span>Model input</span>
              </div>

              <div>
                <strong>91.14%</strong>
                <span>Test accuracy</span>
              </div>

              <div>
                <strong>95.51%</strong>
                <span>Macro ROC AUC</span>
              </div>
            </div>
          </section>

          <section
            id="dataset"
            className="documentation-section"
          >
            <SectionHeading
              number="01"
              title="Dataset"
              description="The dataset structure and sample representation used by the NeuroVision AI training pipeline."
            />

            <div className="documentation-card">
              <h3>Dataset source</h3>

              <p>
                The project uses the BrainTumorDataPublic
                component from the Kaggle MRI dataset
                collection.
              </p>

              <a
                href="https://www.kaggle.com/datasets/sudipde25/mri-dataset-for-detection-and-analysis/data"
                target="_blank"
                rel="noreferrer"
                className="documentation-link"
              >
                View Kaggle dataset
                <ExternalLink size={15} />
              </a>
            </div>

            <div className="documentation-grid two">
              <InfoCard
                title="Input format"
                value=".mat"
                text="MATLAB v7.3 / HDF5-compatible files are read by the training pipeline."
              />

              <InfoCard
                title="Source component"
                value="BrainTumorDataPublic"
                text="The deployed classifier is trained from this component rather than the entire Kaggle package."
              />
            </div>

            <div className="documentation-card">
              <h3>Sample structure</h3>

              <pre>{`cjdata
├── image
├── label
├── PID
├── tumorMask
└── tumorBorder`}</pre>
            </div>

            <div className="documentation-grid three">
              <InfoCard
                title="Class 1"
                value="Meningioma"
                text="Brain tumor category."
              />

              <InfoCard
                title="Class 2"
                value="Glioma"
                text="Brain tumor category."
              />

              <InfoCard
                title="Class 3"
                value="Pituitary"
                text="Brain tumor category."
              />
            </div>
          </section>

          <section
            id="methodology"
            className="documentation-section"
          >
            <SectionHeading
              number="02"
              title="Methodology"
              description="From raw MRI samples to classification and explainability."
            />

            <WorkflowSteps
              steps={[
                ["01", "Dataset loading", "MAT/HDF5 MRI extraction"],
                ["02", "Manifest construction", "Image, class, patient and mask metadata"],
                ["03", "Patient-level splitting", "Leakage-aware train, validation and test partitions"],
                ["04", "Preprocessing", "Normalization, resizing and channel conversion"],
                ["05", "Model training", "ImageNet-pretrained EfficientNet-B0"],
                ["06", "Evaluation", "Classification and probability metrics"],
                ["07", "Explainability", "Grad-CAM and tumor-mask localization"],
              ]}
            />
          </section>

          <section
            id="model"
            className="documentation-section"
          >
            <SectionHeading
              number="03"
              title="Model"
              description="The deployed classifier uses an ImageNet-pretrained EfficientNet-B0 backbone."
            />

            <div className="model-flow">
              <ModelNode
                title="MRI Input"
                text="224 × 224 × 3"
              />

              <span>→</span>

              <ModelNode
                title="EfficientNet-B0"
                text="ImageNet pretrained"
              />

              <span>→</span>

              <ModelNode
                title="Classifier"
                text="3 output logits"
              />

              <span>→</span>

              <ModelNode
                title="Prediction"
                text="Softmax probabilities"
              />
            </div>

            <div className="documentation-grid three">
              <InfoCard
                title="Meningioma"
                value="Class 1"
                text="Output category."
              />

              <InfoCard
                title="Glioma"
                value="Class 2"
                text="Output category."
              />

              <InfoCard
                title="Pituitary"
                value="Class 3"
                text="Output category."
              />
            </div>
          </section>

          <section
            id="training"
            className="documentation-section"
          >
            <SectionHeading
              number="04"
              title="Training"
              description="Training configuration used by the model development pipeline."
            />

            <div className="documentation-table-wrapper">
              <table className="documentation-table">
                <tbody>
                  <TableRow label="Architecture" value="EfficientNet-B0" />
                  <TableRow label="Input size" value="224 × 224" />
                  <TableRow label="Batch size" value="16" />
                  <TableRow label="Maximum epochs" value="50" />
                  <TableRow label="Learning rate" value="1e-4" />
                  <TableRow label="Weight decay" value="1e-4" />
                  <TableRow label="Optimizer" value="AdamW" />
                  <TableRow label="Label smoothing" value="0.05" />
                  <TableRow label="Early stopping" value="7 epochs" />
                  <TableRow label="Scheduler" value="ReduceLROnPlateau" />
                  <TableRow label="Seed" value="42" />
                </tbody>
              </table>
            </div>

            <div className="documentation-callout">
              <strong>Best checkpoint</strong>
              <span>
                The training pipeline selected the checkpoint
                according to validation Macro F1 rather than
                training loss alone.
              </span>
            </div>
          </section>

          <section
            id="results"
            className="documentation-section"
          >
            <SectionHeading
              number="05"
              title="Results"
              description="Final test-set performance reported by the training pipeline."
            />

            <div className="documentation-metric-grid">
              <Metric value="91.14%" label="Accuracy" />
              <Metric value="90.27%" label="Macro F1" />
              <Metric value="95.51%" label="Macro ROC AUC" />
              <Metric value="0.8662" label="MCC" />
            </div>

            <div className="documentation-card">
              <h3>Class-level performance</h3>

              <div className="documentation-table-wrapper">
                <table className="documentation-table">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Precision</th>
                      <th>Recall</th>
                      <th>F1</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Meningioma</td>
                      <td>83%</td>
                      <td>83%</td>
                      <td>83%</td>
                    </tr>

                    <tr>
                      <td>Glioma</td>
                      <td>99%</td>
                      <td>90%</td>
                      <td>94%</td>
                    </tr>

                    <tr>
                      <td>Pituitary</td>
                      <td>88%</td>
                      <td>99%</td>
                      <td>93%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section
            id="xai"
            className="documentation-section"
          >
            <SectionHeading
              number="06"
              title="Explainable AI"
              description="Grad-CAM is used to visualize image regions contributing to the model prediction."
            />

            <div className="xai-flow">
              <ModelNode
                title="MRI"
                text="Input sample"
              />

              <span>→</span>

              <ModelNode
                title="EfficientNet-B0"
                text="Classification"
              />

              <span>→</span>

              <ModelNode
                title="Grad-CAM"
                text="Gradient-based localization"
              />

              <span>→</span>

              <ModelNode
                title="Tumor mask"
                text="Localization comparison"
              />
            </div>

            <div className="documentation-grid four">
              <InfoCard
                title="CAM IoU"
                value="Localization"
                text="Overlap between CAM region and tumor mask."
              />

              <InfoCard
                title="CAM Precision"
                value="Localization"
                text="How much of the highlighted region overlaps the mask."
              />

              <InfoCard
                title="CAM Recall"
                value="Localization"
                text="How much of the annotated tumor region is highlighted."
              />

              <InfoCard
                title="Area Ratio"
                value="Activation"
                text="Relative activated region size."
              />
            </div>

            <div className="documentation-callout">
              <strong>Hosted limitation</strong>
              <span>
                The current free hosted deployment provides
                classification only. The complete Grad-CAM
                workflow is available in the local release.
              </span>
            </div>

            <a
              href="https://github.com/0mehedihasan/neurovision-ai/releases/tag/V1"
              target="_blank"
              rel="noreferrer"
              className="documentation-primary-link"
            >
              Open V1 local release
              <ExternalLink size={16} />
            </a>
          </section>

          <section
            id="workflow"
            className="documentation-section"
          >
            <SectionHeading
              number="07"
              title="Project Workflow"
              description="End-to-end development and deployment workflow."
            />

            <WorkflowSteps
              steps={[
                ["01", "Dataset", "Kaggle MRI dataset"],
                ["02", "Processing", "MAT/HDF5 parsing and normalization"],
                ["03", "Splitting", "Patient-level partitions"],
                ["04", "Training", "EfficientNet-B0 classification"],
                ["05", "Evaluation", "Metrics and test-set analysis"],
                ["06", "XAI", "Grad-CAM localization"],
                ["07", "Deployment", "FastAPI + Render + Vercel"],
              ]}
            />
          </section>

          <section
            id="installation"
            className="documentation-section"
          >
            <SectionHeading
              number="08"
              title="Local Installation"
              description="Run the complete NeuroVision AI project locally."
            />

            <InstallStep
              number="01"
              title="Clone the repository"
              code={`git clone https://github.com/0mehedihasan/neurovision-ai.git
cd neurovision-ai`}
            />

            <InstallStep
              number="02"
              title="Install backend dependencies"
              code={`cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt`}
            />

            <InstallStep
              number="03"
              title="Start the backend"
              code={`uvicorn app.main:app --reload`}
            />

            <InstallStep
              number="04"
              title="Start the frontend"
              code={`cd frontend
npm install
npm run dev`}
            />

            <div className="documentation-callout">
              <strong>Local URLs</strong>
              <span>
                Frontend: http://localhost:5173
                <br />
                Backend: http://127.0.0.1:8000
                <br />
                API docs: http://127.0.0.1:8000/docs
              </span>
            </div>
          </section>

          <section
            id="api"
            className="documentation-section"
          >
            <SectionHeading
              number="09"
              title="API"
              description="FastAPI endpoints exposed by the NeuroVision AI backend."
            />

            <div className="api-list">
              <ApiEndpoint
                method="GET"
                path="/health"
                description="Check backend and model health."
              />

              <ApiEndpoint
                method="GET"
                path="/model-info"
                description="Retrieve model configuration information."
              />

              <ApiEndpoint
                method="POST"
                path="/predict"
                description="Upload a MAT MRI sample and receive class probabilities."
              />

              <ApiEndpoint
                method="POST"
                path="/explain"
                description="Generate Grad-CAM explanation in the local workflow."
              />

              <ApiEndpoint
                method="GET"
                path="/gradcam/{filename}"
                description="Retrieve a generated Grad-CAM visualization."
              />
            </div>

            <div className="documentation-card">
              <h3>Prediction response</h3>

              <pre>{`{
  "predicted_class": "Meningioma",
  "confidence": 0.9992,
  "probabilities": {
    "Meningioma": 0.9992,
    "Glioma": 0.00015,
    "Pituitary": 0.00063
  }
}`}</pre>
            </div>
          </section>

          <section
            id="deployment"
            className="documentation-section"
          >
            <SectionHeading
              number="10"
              title="Deployment"
              description="The public application separates the frontend and inference backend."
            />

            <div className="deployment-flow">
              <ModelNode
                title="Vercel"
                text="React / Vite frontend"
              />

              <span>→</span>

              <ModelNode
                title="Render"
                text="FastAPI backend"
              />

              <span>→</span>

              <ModelNode
                title="EfficientNet-B0"
                text="CPU inference"
              />
            </div>

            <div className="documentation-card">
              <h3>Hosted application</h3>

              <a
                href="https://neurovision-ai-ten.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="documentation-link"
              >
                Open NeuroVision AI
                <ExternalLink size={15} />
              </a>
            </div>
          </section>

          <section
            id="limitations"
            className="documentation-section"
          >
            <SectionHeading
              number="11"
              title="Limitations"
              description="Important considerations when interpreting the current system."
            />

            <div className="limitation-list">
              <div>
                <strong>Three-class scope</strong>
                <span>
                  The classifier predicts Meningioma,
                  Glioma, or Pituitary.
                </span>
              </div>

              <div>
                <strong>Hosted XAI</strong>
                <span>
                  Grad-CAM is not enabled in the current
                  free hosted inference workflow.
                </span>
              </div>

              <div>
                <strong>CPU deployment</strong>
                <span>
                  The public inference service operates
                  without dedicated GPU acceleration.
                </span>
              </div>

              <div>
                <strong>Cold starts</strong>
                <span>
                  The free hosted backend may experience
                  delays after periods of inactivity.
                </span>
              </div>

              <div>
                <strong>Research system</strong>
                <span>
                  NeuroVision AI is intended as a research
                  and demonstration system, not a standalone
                  clinical diagnostic device.
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SectionHeading({
  number,
  title,
  description,
}) {
  return (
    <div className="documentation-section-heading">
      <span>{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function InfoCard({ title, value, text }) {
  return (
    <div className="documentation-info-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </div>
  );
}

function Metric({ value, label }) {
  return (
    <div className="documentation-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function ModelNode({ title, text }) {
  return (
    <div className="model-node">
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function TableRow({ label, value }) {
  return (
    <tr>
      <td>{label}</td>
      <td>{value}</td>
    </tr>
  );
}

function WorkflowSteps({ steps }) {
  return (
    <div className="documentation-workflow">
      {steps.map(([number, title, text]) => (
        <div
          className="documentation-workflow-step"
          key={number}
        >
          <span>{number}</span>
          <div>
            <strong>{title}</strong>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InstallStep({ number, title, code }) {
  return (
    <div className="installation-step">
      <div className="installation-step-heading">
        <span>{number}</span>
        <h3>{title}</h3>
      </div>

      <pre>{code}</pre>
    </div>
  );
}

function ApiEndpoint({
  method,
  path,
  description,
}) {
  return (
    <div className="api-endpoint">
      <span className={`api-method ${method.toLowerCase()}`}>
        {method}
      </span>

      <code>{path}</code>

      <p>{description}</p>
    </div>
  );
}

export default Documentation;
