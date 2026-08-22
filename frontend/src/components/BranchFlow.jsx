// Renders a single trunk node fanning out into multiple branch outcomes.
// Used for softmax -> 3 classes, and prediction / Grad-CAM dual paths.
function BranchFlow({ trunk, branches }) {
  return (
    <div className="branch-flow">
      <div className="branch-flow-trunk">
        <span className="branch-flow-trunk-label">{trunk}</span>
      </div>

      <div className="branch-flow-connector" aria-hidden="true" />

      <div className="branch-flow-row">
        {branches.map((branch) => (
          <div className="branch-flow-item" key={branch.title}>
            <span className="branch-flow-item-title">
              {branch.title}
            </span>

            {branch.text && (
              <span className="branch-flow-item-text">
                {branch.text}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BranchFlow;
