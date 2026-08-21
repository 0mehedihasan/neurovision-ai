import { useCallback, useState } from "react";
import { predictMRI, explainMRI } from "../services/api";

export function useAnalysis() {
  const [result, setResult] = useState(null);
  const [gradcam, setGradcam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = useCallback(async (file) => {
    if (!file) {
      setError("Please select an MRI file first.");
      return null;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setGradcam(null);

    try {
      const prediction = await predictMRI(file);

      setResult(prediction);

      try {
        const explanation = await explainMRI(file);
        setGradcam(explanation);
      } catch (gradcamError) {
        console.error("Grad-CAM generation failed:", gradcamError);
      }

      return prediction;
    } catch (err) {
      console.error("MRI analysis failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze the MRI."
      );

      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setGradcam(null);
    setError("");
    setLoading(false);
  }, []);

  return {
    result,
    gradcam,
    loading,
    error,
    analyze,
    reset,
  };
}
