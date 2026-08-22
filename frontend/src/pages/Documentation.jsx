import { useState } from "react";
import {
  BookOpen,
  Database,
  GitBranch,
  Waves,
  Users,
  Scale,
  Cpu,
  FlaskConical,
  BarChart3,
  ScanSearch,
  Terminal,
  Code2,
  Cloud,
  FolderGit2,
  AlertTriangle,
  Link2,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

const sections = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "dataset", label: "Dataset", icon: Database },
  { id: "methodology", label: "Methodology", icon: GitBranch },
  { id: "preprocessing", label: "Preprocessing", icon: Waves },
  { id: "patient-split", label: "Patient-Level Splitting", icon: Users },
  { id: "class-balancing", label: "Class Balancing", icon: Scale },
  { id: "model", label: "Model Architecture", icon: Cpu },
  { id: "training", label: "Training Configuration", icon: FlaskConical },
  { id: "results", label: "Results", icon: BarChart3 },
  { id: "xai", label: "Explainable AI", icon: ScanSearch },
  { id: "workflow", label: "Project Workflow", icon: GitBranch },
  { id: "installation", label: "Local Installation", icon: Terminal },
  { id: "api", label: "API Reference", icon: Code2 },
  { id: "deployment", label: "Deployment Architecture", icon: Cloud },
  { id: "demo-samples", label: "Demo Samples", icon: FolderGit2 },
  { id: "limitations", label: "Limitations", icon: AlertTriangle },
  { id: "resources", label: "Project Resources", icon: Link2 },
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

          {/* 01 — OVERVIEW */}
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

          {/* 02 — DATASET */}
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

              <p>
                The MRI image is used for classification. The
                tumor mask is not used as classifier input — it
                is used independently for quantitative Grad-CAM
                localization evaluation.
              </p>
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

            <div className="documentation-table-wrapper">
              <table className="documentation-table">
                <thead>
                  <tr>
                    <th>Partition</th>
                    <th>Samples</th>
                    <th>Patients</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Training</td>
                    <td>1,947</td>
                    <td>148</td>
                  </tr>

                  <tr>
                    <td>Validation</td>
                    <td>474</td>
                    <td>38</td>
                  </tr>

                  <tr>
                    <td>Test</td>
                    <td>643</td>
                    <td>47</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 03 — METHODOLOGY */}
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
                ["05", "Class balancing", "Weighted, label-smoothed training objective"],
                ["06", "Model training", "ImageNet-pretrained EfficientNet-B0"],
                ["07", "Evaluation", "Classification and probability metrics"],
                ["08", "Explainability", "Grad-CAM and tumor-mask localization"],
                ["09", "Deployment", "FastAPI backend + Vercel/Render hosting"],
              ]}
            />
          </section>

          {/* 04 — PREPROCESSING */}
          <section
            id="preprocessing"
            className="documentation-section"
          >
            <SectionHeading
              number="03"
              title="Preprocessing"
              description="MRI intensity normalization and formatting applied before the model sees a sample."
            />

            <WorkflowSteps
              steps={[
                ["01", "Raw MRI", "Loaded from the MAT sample"],
                ["02", "NaN / Inf handling", "Invalid values are cleaned"],
                ["03", "Percentile normalization", "1st–99th percentile intensity normalization"],
                ["04", "0–255 scaling", "Rescaled to standard image range"],
                ["05", "Grayscale → RGB", "3-channel conversion"],
                ["06", "224 × 224 resize", "Matches EfficientNet-B0 input size"],
                ["07", "ImageNet normalization", "Mean [0.485, 0.456, 0.406] / Std [0.229, 0.224, 0.225]"],
              ]}
            />

            <div className="documentation-grid two">
              <InfoCard
                title="Training"
                value="Augmented"
                text="Random horizontal flip, random rotation (±10°), and color jitter."
              />

              <InfoCard
                title="Validation / Test"
                value="Deterministic"
                text="No augmentation — identical preprocessing every run."
              />
            </div>
          </section>

          {/* 05 — PATIENT-LEVEL SPLITTING */}
          <section
            id="patient-split"
            className="documentation-section"
          >
            <SectionHeading
              number="04"
              title="Patient-Level Splitting"
              description="MRI samples belonging to the same patient are constrained to a single data partition."
            />

            <div className="documentation-card">
              <h3>Leakage prevention</h3>

              <div className="disjoint-set-row">
                <span>Train ∩ Validation = ∅</span>
                <span>Train ∩ Test = ∅</span>
                <span>Validation ∩ Test = ∅</span>
              </div>

              <p>
                The pipeline verifies patient-set separation
                between partitions before training begins. Five
                predefined folds from <code>cvind.mat</code> are
                used, with fold 5 held out as the test set and
                the remaining folds used for training and
                validation.
              </p>
            </div>

            <div className="documentation-table-wrapper">
              <table className="documentation-table">
                <thead>
                  <tr>
                    <th>Partition</th>
                    <th>Samples</th>
                    <th>Patients</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Training</td>
                    <td>1,947</td>
                    <td>148</td>
                  </tr>

                  <tr>
                    <td>Validation</td>
                    <td>474</td>
                    <td>38</td>
                  </tr>

                  <tr>
                    <td>Test</td>
                    <td>643</td>
                    <td>47</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 06 — CLASS BALANCING */}
          <section
            id="class-balancing"
            className="documentation-section"
          >
            <SectionHeading
              number="05"
              title="Class Balancing"
              description="Class imbalance is addressed with distribution-derived weights rather than resampling."
            />

            <div className="documentation-card">
              <h3>Weighted, label-smoothed objective</h3>

              <p>
                Class weights are calculated from the training
                distribution and combined with label smoothing
                to reduce overconfident target assignments.
              </p>

              <pre>{`weight_c = N / (K × N_c)

CrossEntropyLoss(
  weight=class_weights,
  label_smoothing=0.05
)`}</pre>
            </div>
          </section>

          {/* 07 — MODEL ARCHITECTURE */}
          <section
            id="model"
            className="documentation-section"
          >
            <SectionHeading
              number="06"
              title="Model Architecture"
              description="The deployed classifier uses an ImageNet-pretrained EfficientNet-B0 backbone."
            />

            <div className="model-flow">
              <ModelNode title="MRI Input" text="224 × 224 × 3" />
              <span>→</span>
              <ModelNode title="EfficientNet-B0" text="ImageNet pretrained" />
              <span>→</span>
              <ModelNode title="Feature Extraction" text="Backbone output" />
              <span>→</span>
              <ModelNode title="Classifier" text="3 output logits" />
              <span>→</span>
              <ModelNode title="Prediction" text="Softmax probabilities" />
            </div>

            <p className="documentation-note">
              The original EfficientNet-B0 classifier is replaced
              with a three-output classification layer.
            </p>

            <div className="documentation-grid three">
              <InfoCard title="Meningioma" value="Class 1" text="Output category." />
              <InfoCard title="Glioma" value="Class 2" text="Output category." />
              <InfoCard title="Pituitary" value="Class 3" text="Output category." />
            </div>

            <div className="documentation-table-wrapper">
              <table className="documentation-table">
                <tbody>
                  <TableRow label="Architecture" value="EfficientNet-B0" />
                  <TableRow label="Parameters" value="4,011,391" />
                  <TableRow label="Trainable parameters" value="4,011,391" />
                  <TableRow label="Input size" value="224 × 224" />
                  <TableRow label="Input channels" value="3" />
                  <TableRow label="Source image" value="Grayscale MRI" />
                  <TableRow label="Conversion" value="Grayscale → RGB" />
                  <TableRow label="Output classes" value="3" />
                </tbody>
              </table>
            </div>
          </section>

          {/* 08 — TRAINING CONFIGURATION */}
          <section
            id="training"
            className="documentation-section"
          >
            <SectionHeading
              number="07"
              title="Training Configuration"
              description="Configuration used by the final experiment, and how it actually trained."
            />

            <div className="documentation-table-wrapper">
              <table className="documentation-table">
                <tbody>
                  <TableRow label="Architecture" value="EfficientNet-B0" />
                  <TableRow label="Batch size" value="16" />
                  <TableRow label="Maximum epochs" value="50" />
                  <TableRow label="Learning rate" value="1e-4" />
                  <TableRow label="Weight decay" value="1e-4" />
                  <TableRow label="Optimizer" value="AdamW" />
                  <TableRow label="Label smoothing" value="0.05" />
                  <TableRow label="Gradient clipping" value="1.0" />
                  <TableRow label="Early stopping patience" value="7 epochs" />
                  <TableRow label="Selection metric" value="Validation Macro F1" />
                  <TableRow label="Random seed" value="42" />
                </tbody>
              </table>
            </div>

            <div className="documentation-callout">
              <strong>Actual training behavior</strong>
              <span>
                Configured for a maximum of 50 epochs, the model
                was actually trained for 15 epochs before early
                stopping triggered. The best checkpoint was saved
                at epoch 8, with a validation Macro F1 of 0.9629,
                and selected according to validation Macro F1
                rather than final training loss.
              </span>
            </div>
          </section>

          {/* 09 — RESULTS */}
          <section
            id="results"
            className="documentation-section"
          >
            <SectionHeading
              number="08"
              title="Results"
              description="Final test-set performance reported by the training pipeline, on 643 held-out samples."
            />

            <div className="documentation-metric-grid">
              <Metric value="91.14%" label="Accuracy" />
              <Metric value="90.95%" label="Balanced Accuracy" />
              <Metric value="90.27%" label="Macro F1" />
              <Metric value="91.16%" label="Weighted F1" />
              <Metric value="0.8662" label="MCC" />
              <Metric value="0.8642" label="Cohen's Kappa" />
              <Metric value="95.85%" label="Macro Specificity" />
              <Metric value="95.51%" label="Macro ROC AUC" />
              <Metric value="91.28%" label="Macro PR AUC" />
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
                      <th>ROC AUC</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>Meningioma</td>
                      <td>83.13%</td>
                      <td>83.13%</td>
                      <td>83.13%</td>
                      <td>0.9085</td>
                    </tr>

                    <tr>
                      <td>Glioma</td>
                      <td>98.85%</td>
                      <td>90.24%</td>
                      <td>94.35%</td>
                      <td>0.9843</td>
                    </tr>

                    <tr>
                      <td>Pituitary</td>
                      <td>87.91%</td>
                      <td>99.47%</td>
                      <td>93.33%</td>
                      <td>0.9725</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 10 — EXPLAINABLE AI */}
          <section
            id="xai"
            className="documentation-section"
          >
            <SectionHeading
              number="09"
              title="Explainable AI"
              description="Grad-CAM is used to visualize image regions contributing to the model prediction."
            />

            <div className="xai-flow">
              <ModelNode title="MRI" text="Input sample" />
              <span>→</span>
              <ModelNode title="EfficientNet-B0" text="Classification" />
              <span>→</span>
              <ModelNode title="Target Layer" text="model.features[-1]" />
              <span>→</span>
              <ModelNode title="Grad-CAM" text="Gradient-based localization" />
              <span>→</span>
              <ModelNode title="Tumor mask" text="Localization comparison" />
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

          {/* 11 — PROJECT WORKFLOW */}
          <section
            id="workflow"
            className="documentation-section"
          >
            <SectionHeading
              number="10"
              title="Project Workflow"
              description="End-to-end development and deployment workflow."
            />

            <WorkflowSteps
              steps={[
                ["01", "Dataset", "Kaggle MRI dataset"],
                ["02", "Preprocessing", "MAT/HDF5 parsing and normalization"],
                ["03", "Splitting", "Patient-level partitions"],
                ["04", "Training", "EfficientNet-B0 classification"],
                ["05", "Evaluation", "Metrics and test-set analysis"],
                ["06", "Explainability", "Grad-CAM localization"],
                ["07", "Deployment", "FastAPI + Render + Vercel"],
              ]}
            />
          </section>

          {/* 12 — LOCAL INSTALLATION */}
          <section
            id="installation"
            className="documentation-section"
          >
            <SectionHeading
              number="11"
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

          {/* 13 — API REFERENCE */}
          <section
            id="api"
            className="documentation-section"
          >
            <SectionHeading
              number="12"
              title="API Reference"
              description="FastAPI endpoints exposed by the NeuroVision AI backend."
            />

            <div className="api-list">
              <ApiEndpoint method="GET" path="/" description="API status." />

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
                description="Upload a MAT/PNG/JPG/JPEG/WEBP MRI sample and receive class probabilities."
              />

              <ApiEndpoint
                method="POST"
                path="/explain"
                description="Generate a Grad-CAM explanation in the local workflow."
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

          {/* 14 — DEPLOYMENT ARCHITECTURE */}
          <section
            id="deployment"
            className="documentation-section"
          >
            <SectionHeading
              number="13"
              title="Deployment Architecture"
              description="The public application separates the frontend and inference backend."
            />

            <div className="deployment-flow">
              <ModelNode title="Vercel" text="React / Vite frontend" />
              <span>→</span>
              <ModelNode title="Render" text="FastAPI backend" />
              <span>→</span>
              <ModelNode title="EfficientNet-B0" text="CPU inference" />
            </div>

            <div className="documentation-grid two">
              <InfoCard
                title="CORS"
                value="Enabled"
                text="The backend allows the production Vercel origin plus local development origins (ports 5173 and 3000)."
              />

              <InfoCard
                title="Hosting"
                value="Separated"
                text="Vercel serves the frontend; Render hosts the Python/PyTorch inference service."
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

          {/* 15 — DEMO SAMPLES */}
          <section
            id="demo-samples"
            className="documentation-section"
          >
            <SectionHeading
              number="14"
              title="Demo Samples"
              description="Real MRI samples for trying NeuroVision AI without your own file."
            />

            <div className="documentation-card">
              <h3>Repository demo samples</h3>

              <p>
                Six real MAT demo MRI files from the
                repository&apos;s <code>assets/demo/</code> folder are
                served by the frontend. The &quot;Try a demo
                sample&quot; control on the homepage loads one of
                these files directly and runs it through the same
                upload-to-prediction pipeline as a manually
                selected file.
              </p>

              <a
                href="https://github.com/0mehedihasan/neurovision-ai/tree/main/assets/demo"
                target="_blank"
                rel="noreferrer"
                className="documentation-link"
              >
                Browse demo samples
                <ExternalLink size={15} />
              </a>
            </div>
          </section>

          {/* 16 — LIMITATIONS */}
          <section
            id="limitations"
            className="documentation-section"
          >
            <SectionHeading
              number="15"
              title="Limitations"
              description="Important considerations when interpreting the current system."
            />

            <div className="limitation-list">
              <div>
                <strong>Three-class scope</strong>
                <span>
                  The classifier predicts Meningioma,
                  Glioma, or Pituitary and should not be
                  interpreted as a general brain tumor
                  classifier.
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
                <strong>Model confidence</strong>
                <span>
                  Model confidence should not be interpreted
                  as clinical certainty.
                </span>
              </div>

              <div>
                <strong>Grad-CAM scope</strong>
                <span>
                  Grad-CAM provides model-attribution
                  visualization rather than a clinical
                  segmentation result.
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

          {/* 17 — PROJECT RESOURCES */}
          <section
            id="resources"
            className="documentation-section"
          >
            <SectionHeading
              number="16"
              title="Project Resources"
              description="Where to find the source, dataset, local release, and demo samples."
            />

            <div className="documentation-grid two">
              <ResourceLink
                title="Source Repository"
                text="Explore the complete NeuroVision AI project source code."
                url="https://github.com/0mehedihasan/neurovision-ai"
                label="View on GitHub"
              />

              <ResourceLink
                title="MRI Dataset"
                text="View the Kaggle MRI dataset used by the project."
                url="https://www.kaggle.com/datasets/sudipde25/mri-dataset-for-detection-and-analysis/data"
                label="Open Kaggle Dataset"
              />

              <ResourceLink
                title="V1 Local Release"
                text="Access the NeuroVision AI V1 local release containing the research and explainability workflow."
                url="https://github.com/0mehedihasan/neurovision-ai/releases/tag/V1"
                label="View V1 Release"
              />

              <ResourceLink
                title="Demo Samples"
                text="Browse the MRI samples provided for testing NeuroVision AI."
                url="https://github.com/0mehedihasan/neurovision-ai/tree/main/assets/demo"
                label="Browse Samples"
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function SectionHeading({ number, title, description }) {
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

function ApiEndpoint({ method, path, description }) {
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

function ResourceLink({ title, text, url, label }) {
  return (
    <div className="documentation-info-card">
      <strong>{title}</strong>
      <p>{text}</p>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="documentation-link"
      >
        {label}
        <ExternalLink size={14} />
      </a>
    </div>
  );
}

export default Documentation;
