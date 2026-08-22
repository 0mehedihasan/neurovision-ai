import { useState } from "react";
import Home from "./pages/Home";
import Documentation from "./pages/Documentation";

function App() {
  const [page, setPage] = useState(
    window.location.pathname === "/documentation"
      ? "documentation"
      : "home"
  );

  const navigate = (target) => {
    const path =
      target === "documentation"
        ? "/documentation"
        : "/";

    window.history.pushState({}, "", path);
    setPage(target);
    window.scrollTo(0, 0);
  };

  if (page === "documentation") {
    return (
      <Documentation
        onNavigateHome={() => navigate("home")}
      />
    );
  }

  return (
    <Home
      onOpenDocumentation={() =>
        navigate("documentation")
      }
    />
  );
}

export default App;
