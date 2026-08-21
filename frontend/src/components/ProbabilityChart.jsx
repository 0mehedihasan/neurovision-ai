function ProbabilityChart({
  probabilities = {},
}) {
  const entries = Object.entries(
    probabilities
  );

  return (
    <div className="probability-list">
      {entries.map(([label, value]) => {
        const percentage =
          Number(value) * 100;

        return (
          <div
            className="probability-item"
            key={label}
          >
            <div className="probability-header">
              <span>{label}</span>

              <strong>
                {percentage.toFixed(2)}%
              </strong>
            </div>

            <div className="probability-track">
              <div
                className="probability-fill"
                style={{
                  width: `${Math.min(
                    percentage,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProbabilityChart;
