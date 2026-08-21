import { ExternalLink } from "lucide-react";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>NeuroVision AI</strong>
          <p>AI-assisted brain MRI analysis and explainability.</p>
        </div>

        <div className="footer-right">
          <span>
            Created by <strong>Md. Mehedi Hasan</strong>
          </span>

          <div className="footer-links">
            <a
              href="https://github.com/0mehedihasan/neurovision-ai"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <ExternalLink size={14} />
            </a>

            <a
              href="https://www.linkedin.com/in/0mehedihasan/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
