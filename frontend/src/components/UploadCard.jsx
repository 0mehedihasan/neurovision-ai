import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileImage,
  X,
  ArrowRight,
  FlaskConical,
  Loader2,
  ImageOff,
} from "lucide-react";

import { getPreview } from "../services/api";

const ACCEPTED_FILES = ".mat,.png,.jpg,.jpeg,.webp";

const PREVIEWABLE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
];

const DEMO_SAMPLES = [
  {
    id: "sample-01",
    name: "Sample 01",
    filename: "sample_01_1.mat",
    url: "/demo/sample_01_1.mat",
  },
  {
    id: "sample-02",
    name: "Sample 02",
    filename: "sample_02_10.mat",
    url: "/demo/sample_02_10.mat",
  },
  {
    id: "sample-03",
    name: "Sample 03",
    filename: "sample_03_100.mat",
    url: "/demo/sample_03_100.mat",
  },
  {
    id: "sample-04",
    name: "Sample 04",
    filename: "sample_04_101.mat",
    url: "/demo/sample_04_101.mat",
  },
  {
    id: "sample-05",
    name: "Sample 05",
    filename: "sample_05_102.mat",
    url: "/demo/sample_05_102.mat",
  },
  {
    id: "sample-06",
    name: "Sample 06",
    filename: "sample_06_1841.mat",
    url: "/demo/sample_06_1841.mat",
  },
];

function getExtension(filename = "") {
  return `.${filename.split(".").pop().toLowerCase()}`;
}

function UploadCard({
  file,
  onFileSelect,
  onAnalyze,
  loading = false,
}) {
  const inputRef = useRef(null);

  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [previewErrorMessage, setPreviewErrorMessage] =
    useState("");
  const [isDemoFile, setIsDemoFile] = useState(false);

  // Build/revoke an object URL preview whenever the selected
  // file changes. PNG/JPG/JPEG/WEBP are previewed instantly in
  // the browser. MAT v7.3 files aren't directly renderable, so
  // they're sent to the backend's /preview endpoint, which
  // reuses the same load_image() used for /predict to decode
  // them into a PNG.
  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;

    if (!file) {
      setPreviewUrl(null);
      setPreviewLoading(false);
      setPreviewFailed(false);
      setPreviewErrorMessage("");
      return undefined;
    }

    const extension = getExtension(file.name);

    if (PREVIEWABLE_EXTENSIONS.includes(extension)) {
      objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setPreviewLoading(false);
      setPreviewFailed(false);
      setPreviewErrorMessage("");
    } else if (extension === ".mat") {
      setPreviewUrl(null);
      setPreviewFailed(false);
      setPreviewErrorMessage("");
      setPreviewLoading(true);

      getPreview(file)
        .then((blob) => {
          if (cancelled) {
            return;
          }

          objectUrl = URL.createObjectURL(blob);
          setPreviewUrl(objectUrl);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(
            "MRI preview request failed:",
            error
          );

          if (!cancelled) {
            setPreviewFailed(true);
            setPreviewErrorMessage(
              error?.message || ""
            );
          }
        })
        .finally(() => {
          if (!cancelled) {
            setPreviewLoading(false);
          }
        });
    } else {
      setPreviewUrl(null);
      setPreviewLoading(false);
      setPreviewFailed(true);
      setPreviewErrorMessage("");
    }

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  const isMatFile = file
    ? getExtension(file.name) === ".mat"
    : false;

  const openFilePicker = () => {
    if (!loading && !demoLoading) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setDemoError("");
    setIsDemoFile(false);
    onFileSelect(selectedFile);

    event.target.value = "";
  };

  const removeFile = (event) => {
    event.stopPropagation();

    if (loading || demoLoading) {
      return;
    }

    setDemoError("");
    setIsDemoFile(false);
    onFileSelect(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (loading || demoLoading) {
      return;
    }

    const droppedFile = event.dataTransfer.files?.[0];

    if (!droppedFile) {
      return;
    }

    const extension = getExtension(droppedFile.name);

    if (!ACCEPTED_FILES.split(",").includes(extension)) {
      setDemoError(
        "Unsupported file type. Use MAT, PNG, JPG, JPEG, or WEBP."
      );
      return;
    }

    setDemoError("");
    setIsDemoFile(false);
    onFileSelect(droppedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDemoSample = async (sample) => {
    if (loading || demoLoading) {
      return;
    }

    setDemoLoading(true);
    setDemoError("");

    try {
      const response = await fetch(sample.url);

      if (!response.ok) {
        throw new Error(
          "Could not load this demo sample. Please try another sample."
        );
      }

      const blob = await response.blob();

      const demoFile = new File(
        [blob],
        sample.filename,
        {
          type: "application/octet-stream",
          lastModified: Date.now(),
        }
      );

      setIsDemoFile(true);
      onFileSelect(demoFile);
    } catch (error) {
      setDemoError(
        error?.message ||
          "Could not load this demo sample. Please try another sample."
      );
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <section className="upload-section">
      <div className="section-label">
        STEP 1
      </div>

      <div className="upload-heading">
        <div>
          <h2>Upload your MRI</h2>

          <p>
            Upload a supported MRI sample or try one
            of the provided demonstration samples.
          </p>
        </div>
      </div>

      <div
        className={`upload-card ${
          file ? "has-file" : ""
        } ${loading ? "is-loading" : ""} ${
          demoLoading ? "is-demo-loading" : ""
        }`}
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="button"
        tabIndex={0}
        aria-label="Upload MRI file"
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();
            openFilePicker();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILES}
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={
            loading || demoLoading
          }
        />

        {!file ? (
          <>
            <div className="upload-icon">
              <Upload
                size={28}
                strokeWidth={1.8}
              />
            </div>

            <div className="upload-content">
              <h3>Choose an MRI scan</h3>

              <p>
                Drag and drop a file here or
                click to browse
              </p>

              <span>
                MAT, PNG, JPG, JPEG or WEBP
              </span>
            </div>
          </>
        ) : (
          <>
            <div
              className="mri-preview"
              onClick={(event) => event.stopPropagation()}
            >
              <span className="mri-preview-label">
                MRI Preview
              </span>

              <div className="mri-preview-frame">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={
                      isDemoFile
                        ? "NeuroVision AI demo brain MRI sample"
                        : "Uploaded brain MRI sample"
                    }
                  />
                ) : previewLoading ? (
                  <div className="mri-preview-fallback">
                    <Loader2
                      size={20}
                      strokeWidth={1.8}
                      className="demo-spinner"
                    />

                    <p>Generating preview...</p>
                  </div>
                ) : (
                  <div className="mri-preview-fallback">
                    <ImageOff size={22} strokeWidth={1.7} />

                    <p>
                      {previewFailed && isMatFile
                        ? "Could not generate a preview for this MAT file."
                        : "Preview unavailable."}
                    </p>

                    {previewErrorMessage ? (
                      <span className="mri-preview-error-detail">
                        {previewErrorMessage}
                      </span>
                    ) : null}

                    <span>
                      The file is still ready for analysis.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="upload-content">
              <h3>{file.name}</h3>

              <p>
                {isMatFile ? "MAT file" : "Image file"} ·{" "}
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </p>

              <span>
                Ready for analysis
              </span>
            </div>

            <button
              type="button"
              className="remove-file"
              onClick={removeFile}
              disabled={
                loading || demoLoading
              }
              aria-label="Remove selected file"
            >
              <X size={18} />
            </button>
          </>
        )}
      </div>

      {demoError && (
        <div className="demo-error">
          {demoError}
        </div>
      )}

      <div className="demo-divider">
        <span>OR</span>
      </div>

      <div className="demo-samples">
        <div className="demo-header">
          <div>
            <div className="demo-title-row">
              <FlaskConical size={17} />
              <strong>Try a demo sample</strong>
            </div>

            <p>
              Use one of the provided MRI samples to
              test NeuroVision AI without uploading your
              own file.
            </p>
          </div>
        </div>

        <div className="demo-sample-grid">
          {DEMO_SAMPLES.map((sample) => (
            <button
              type="button"
              key={sample.id}
              className="demo-sample-button"
              onClick={(event) => {
                event.stopPropagation();
                handleDemoSample(sample);
              }}
              disabled={
                loading || demoLoading
              }
              aria-label={`Load ${sample.name} demo MRI`}
            >
              {demoLoading ? (
                <Loader2
                  size={16}
                  className="demo-spinner"
                />
              ) : (
                <FileImage size={16} />
              )}

              <span>{sample.name}</span>
            </button>
          ))}
        </div>

        <span className="demo-note">
          Demonstration samples are provided in the
          NeuroVision AI repository.
        </span>
      </div>

      <button
        type="button"
        className="analyze-button"
        onClick={(event) => {
          event.stopPropagation();
          onAnalyze();
        }}
        disabled={
          !file ||
          loading ||
          demoLoading
        }
      >
        {loading ? (
          <>
            <span className="button-spinner" />
            Analyzing MRI...
          </>
        ) : (
          <>
            Analyze MRI
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </section>
  );
}

export default UploadCard;