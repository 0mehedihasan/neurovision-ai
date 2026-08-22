import {
  Database,
  ExternalLink,
  FlaskConical,
  Github,
  Linkedin,
} from "lucide-react";

const resources = [
  {
    icon: Github,
    title: "Source Code",
    description:
      "Explore the NeuroVision AI implementation, model pipeline, backend, and frontend.",
    label: "GitHub Repository",
    url: "https://github.com/0mehedihasan/neurovision-ai",
  },
  {
    icon: Database,
    title: "MRI Dataset",
    description:
      "Access the MRI dataset used for brain tumor detection and analysis.",
    label: "Kaggle Dataset",
    url: "https://www.kaggle.com/datasets/sudipde25/mri-dataset-for-detection-and-analysis/data",
  },
  {
    icon: FlaskConical,
    title: "Demo Samples",
    description:
      "Use the provided MRI samples to test NeuroVision AI.",
    label: "Browse Demo Samples",
    url: "https://github.com/0mehedihasan/neurovision-ai/tree/main/assets/demo",
  },
  {
    icon: Linkedin,
    title: "Developer",
    description:
      "Connect with Md. Mehedi Hasan and explore his research and professional work.",
    label: "LinkedIn Profile",
    url: "https://www.linkedin.com/in/0mehedihasan/",
  },
];

function ProjectResources() {
  return (
    <section className="resources-section">
      <div className="section-label">PROJECT RESOURCES</div>

      <div className="resources-heading">
        <div>
          <h2>Explore the project</h2>
          <p>
            Learn more about the implementation, dataset, and
            research behind NeuroVision AI.
          </p>
        </div>
      </div>

      <div className="resources-grid">
        {resources.map((resource) => {
          const Icon = resource.icon;

          return (
            <article className="resource-card" key={resource.title}>
              <div className="resource-icon">
                <Icon size={21} />
              </div>

              <h3>{resource.title}</h3>

              <p>{resource.description}</p>

              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="resource-link"
              >
                {resource.label}
                <ExternalLink size={14} />
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ProjectResources;