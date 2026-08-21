import {
  ScanSearch,
  ExternalLink,
} from "lucide-react";

function GradCAMViewer({ data }) {
  if (!data?.gradcam_url) {
    return null;
  }

  return (
    <section className="gradcam-section">
      <div className="gradcam-header">
        <div>
          <div className="section-label">
            STEP 3
          </div>

          <h2>
            Where did the AI look?
          </h2>

          <p>
            Grad-CAM highlights the image regions
            that contributed most to the model's
            prediction.
          </p>
        </div>

        <ScanSearch size={28} />
      </div>

      <div className="gradcam-card">
        <img
          src={data.gradcam_url}
          alt="Grad-CAM visualization showing areas influencing the AI prediction"
        />
      </div>

      <a
        href={data.gradcam_url}
        target="_blank"
        rel="noreferrer"
        className="gradcam-link"
      >
        Open visualization
        <ExternalLink size={16} />
      </a>
    </section>
  );
}

export default GradCAMViewer;
