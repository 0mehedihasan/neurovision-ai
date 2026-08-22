import {
  Upload,
  Brain,
  ScanSearch,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload",
    text: "Upload a supported MRI sample or try a provided demo sample.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Classify",
    text: "EfficientNet-B0 analyzes the MRI and returns class probabilities.",
  },
  {
    number: "03",
    icon: ScanSearch,
    title: "Explain",
    text: "Grad-CAM visualizes the image regions contributing to the prediction.",
  },
];

function HowItWorks() {
  return (
    <section className="how-section">
      <div className="section-label">
        HOW IT WORKS
      </div>

      <h2>Three simple steps</h2>

      <p className="section-description">
        No technical knowledge is required.
      </p>

      <div className="steps-grid">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <article
              className="step-card"
              key={step.number}
            >
              <div className="step-top">
                <span>{step.number}</span>

                <div className="step-icon">
                  <Icon size={22} />
                </div>
              </div>

              <h3>{step.title}</h3>

              <p>{step.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default HowItWorks;