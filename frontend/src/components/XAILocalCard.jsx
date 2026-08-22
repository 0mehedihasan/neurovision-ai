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
            The hosted NeuroVision AI demo provides brain
            tumor classification only. Grad-CAM requires
            additional gradient-based computation that is
            not enabled in the current free hosted deployment.
          </p>

          <p>
            The complete local version includes the
            explainability workflow, allowing you to generate
            Grad-CAM visualizations directly on your machine.
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
