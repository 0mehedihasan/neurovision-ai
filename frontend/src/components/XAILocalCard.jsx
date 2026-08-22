import {
  ScanSearch,
  ExternalLink,
  MonitorCog,
} from "lucide-react";

const RELEASE_URL =
  "https://github.com/0mehedihasan/neurovision-ai/releases/tag/V1";

function XAILocalCard() {
  return (
    <section className="xai-local-section">
      <div className="xai-local-card">
        <div className="xai-local-icon">
          <ScanSearch size={24} />
        </div>

        <div className="xai-local-content">
          <div className="section-label">
            EXPLAINABLE AI
          </div>

          <h2>
            Run Grad-CAM locally
          </h2>

          <p>
            The NeuroVision AI backend implements Grad-CAM
            explainability, but the hosted demo above only
            calls the classification endpoint. Grad-CAM
            visualizations are not yet wired into this public
            deployment's upload flow.
          </p>

          <p>
            To generate Grad-CAM visualizations today, run
            the project locally, where the upload flow calls
            the backend's explainability endpoint directly.
          </p>

          <div className="xai-local-actions">
            <a
              href={RELEASE_URL}
              target="_blank"
              rel="noreferrer"
              className="xai-primary-link"
            >
              <MonitorCog size={17} />
              Run XAI locally
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default XAILocalCard;