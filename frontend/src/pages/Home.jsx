import { useState } from "react";
import {
  Brain,
  ShieldCheck,
  Sparkles,
  ScanSearch,
} from "lucide-react";

import Header from "../components/Header";
import UploadCard from "../components/UploadCard";
import AnalysisResult from "../components/AnalysisResult";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import XAILocalCard from "../components/XAILocalCard";

import { useAnalysis } from "../hooks/useAnalysis";

function Home() {
  const [file, setFile] = useState(null);

  const {
    result,
    loading,
    error,
    analyze,
    reset,
  } = useAnalysis();

  const handleAnalyze = async () => {
    if (!file) {
      return;
    }

    await analyze(file);
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);

    if (!selectedFile) {
      reset();
    }
  };

  return (
    <div className="app">
      <Header />

      <main>
        <section className="hero">
          <div className="hero-badge">
            <Sparkles size={16} />
            AI-assisted MRI classification
          </div>

          <h1>
            Brain MRI classification{" "}
            with <span>explainable AI</span>.
          </h1>

          <p className="hero-description">
            NeuroVision AI uses an EfficientNet-B0 classifier
            to sort brain MRI scans into three tumor
            categories, with probability-based predictions
            and Grad-CAM explainability.
          </p>

          <div className="hero-stats">
            <div>
              <strong>EfficientNet-B0</strong>
              <span>Model</span>
            </div>

            <div>
              <strong>3</strong>
              <span>Tumor Classes</span>
            </div>

            <div>
              <strong>3,064</strong>
              <span>MRI Samples</span>
            </div>

            <div>
              <strong>91.14%</strong>
              <span>Test Accuracy</span>
            </div>

            <div>
              <strong>95.51%</strong>
              <span>Macro ROC AUC</span>
            </div>
          </div>

          <div className="hero-features">
            <div>
              <ShieldCheck size={18} />
              Simple upload process
            </div>

            <div>
              <Brain size={18} />
              AI classification
            </div>

            <div>
              <ScanSearch size={18} />
              Probability analysis
            </div>
          </div>
        </section>

        <div className="content-shell">
          <UploadCard
            file={file}
            onFileSelect={handleFileSelect}
            onAnalyze={handleAnalyze}
            loading={loading}
          />

          {error && (
            <div className="error-message">
              <strong>Analysis could not be completed.</strong>
              <span>{error}</span>
            </div>
          )}

          {result && (
            <AnalysisResult
              result={result}
              gradcam={null}
            />
          )}

          <XAILocalCard />

          <HowItWorks />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;