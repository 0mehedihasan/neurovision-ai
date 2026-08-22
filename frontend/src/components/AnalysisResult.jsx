import {
  CheckCircle2,
  Activity,
  BarChart3,
} from "lucide-react";

import ProbabilityChart from "./ProbabilityChart";
import GradCAMViewer from "./GradCAMViewer";

function formatPercent(value) {
  return `${(Number(value) * 100).toFixed(2)}%`;
}

function AnalysisResult({
  result,
  gradcam,
}) {
  if (!result) {
    return null;
  }

  const confidence =
    Number(result.confidence || 0);

  return (
    <section className="results-section">
      <div className="section-label">
        STEP 2
      </div>

      <h2>Analysis results</h2>

      <div className="result-grid">
        <div className="prediction-card">
          <div className="result-card-header">
            <div className="result-icon">
              <CheckCircle2 size={24} />
            </div>

            <span>AI classification</span>
          </div>

          <div className="prediction-class">
            {result.predicted_class}
          </div>

          <div className="confidence-row">
            <div>
              <span className="confidence-label">
                Confidence
              </span>

              <strong>
                {formatPercent(confidence)}
              </strong>
            </div>

            <Activity size={20} />
          </div>

          <div className="confidence-bar">
            <div
              className="confidence-fill"
              style={{
                width: `${Math.min(
                  confidence * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="probability-card">
          <div className="result-card-header">
            <div className="result-icon">
              <BarChart3 size={24} />
            </div>

            <span>Class probabilities</span>
          </div>

          <ProbabilityChart
            probabilities={
              result.probabilities || {}
            }
          />
        </div>
      </div>

      <p className="probability-disclaimer">
        Model probabilities represent the model&apos;s estimated
        class distribution and should not be interpreted as
        clinical certainty.
      </p>

      {gradcam && (
        <GradCAMViewer
          data={gradcam}
        />
      )}
    </section>
  );
}

export default AnalysisResult;