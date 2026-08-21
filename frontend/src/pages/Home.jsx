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

import { useAnalysis } from "../hooks/useAnalysis";

function Home() {
  const [file, setFile] = useState(null);

  const {
    result,
    gradcam,
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
            AI-assisted MRI analysis
          </div>

          <h1>
            Understand your{" "}
            <span>brain MRI</span>{" "}
            with AI.
          </h1>

          <p className="hero-description">
            Upload a brain MRI scan and NeuroVision AI
            will classify the image and show you the
            areas that influenced its prediction.
          </p>

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
              Visual explanation
            </div>
          </div>
        </section>

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
            gradcam={gradcam}
          />
        )}

        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
