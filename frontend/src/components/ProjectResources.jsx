import {
  Database,
  ExternalLink,
  FlaskConical,
  FolderGit2,
  PackageOpen,
} from "lucide-react";

const resources = [
  {
    icon: FolderGit2,
    title: "Source Repository",
    description:
      "Explore the complete NeuroVision AI project source code.",
    label: "View on GitHub",
    url: "https://github.com/0mehedihasan/neurovision-ai",
  },
  {
    icon: Database,
    title: "MRI Dataset",
    description:
      "View the Kaggle MRI dataset used by the project.",
    label: "Open Kaggle Dataset",
    url: "https://www.kaggle.com/datasets/sudipde25/mri-dataset-for-detection-and-analysis/data",
  },
  {
    icon: PackageOpen,
    title: "V1 Local Release",
    description:
      "Access the NeuroVision AI V1 local release containing the research and explainability workflow.",
    label: "View V1 Release",
    url: "https://github.com/0mehedihasan/neurovision-ai/releases/tag/V1",
  },
  {
    icon: FlaskConical,
    title: "Demo Samples",
    description:
      "Browse the MRI samples provided for testing NeuroVision AI.",
    label: "Browse Samples",
    url: "https://github.com/0mehedihasan/neurovision-ai/tree/main/assets/demo",
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
            The source code, dataset, local release, and demo
            samples behind NeuroVision AI.
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