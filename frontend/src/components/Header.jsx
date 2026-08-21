import { Brain, ExternalLink } from "lucide-react";

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="/" className="brand">
          <span className="brand-mark">
            <Brain size={22} strokeWidth={2.2} />
          </span>

          <span>
            <strong>NeuroVision AI</strong>
            <small>Brain MRI Analysis</small>
          </span>
        </a>

        <a
          className="github-button"
          href="https://github.com/0mehedihasan/neurovision-ai"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
          <ExternalLink size={15} />
        </a>
      </div>
    </header>
  );
}

export default Header;
