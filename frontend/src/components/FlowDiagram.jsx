import { ArrowRight, ArrowDown } from "lucide-react";

// Renders a numbered, connected sequence of stages.
// Horizontal + wrapping on desktop/tablet, vertical on mobile.
// Pure HTML/CSS so every label stays real, selectable, readable text
// at any viewport width (no baked-in SVG text).
function FlowDiagram({ steps, compact = false }) {
  return (
    <div
      className={`flow-diagram ${compact ? "flow-diagram-compact" : ""}`}
    >
      {steps.map((step, index) => (
        <div className="flow-diagram-item" key={step}>
          <div className="flow-diagram-node">
            <span className="flow-diagram-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flow-diagram-label">{step}</span>
          </div>

          {index < steps.length - 1 && (
            <span
              className="flow-diagram-arrow"
              aria-hidden="true"
            >
              <ArrowRight size={16} className="arrow-h" />
              <ArrowDown size={16} className="arrow-v" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default FlowDiagram;
