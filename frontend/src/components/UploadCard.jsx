import { useRef } from "react";
import {
  Upload,
  FileImage,
  X,
  ArrowRight,
} from "lucide-react";

const ACCEPTED_FILES = ".mat,.png,.jpg,.jpeg,.webp";

function UploadCard({
  file,
  onFileSelect,
  onAnalyze,
  loading = false,
}) {
  const inputRef = useRef(null);

  const openFilePicker = () => {
    if (!loading) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    onFileSelect(selectedFile);

    event.target.value = "";
  };

  const removeFile = (event) => {
    event.stopPropagation();
    onFileSelect(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <section className="upload-section">
      <div className="section-label">
        STEP 1
      </div>

      <h2>Upload your MRI</h2>

      <div
        className={`upload-card ${
          file ? "has-file" : ""
        } ${loading ? "is-loading" : ""}`}
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        role="button"
        tabIndex={0}
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
          disabled={loading}
        />

        {!file ? (
          <>
            <div className="upload-icon">
              <Upload size={28} strokeWidth={1.8} />
            </div>

            <div className="upload-content">
              <h3>Choose an MRI scan</h3>

              <p>
                Click here to browse your files
              </p>

              <span>
                MAT, PNG, JPG, JPEG or WEBP
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="upload-icon file-selected">
              <FileImage
                size={28}
                strokeWidth={1.8}
              />
            </div>

            <div className="upload-content">
              <h3>{file.name}</h3>

              <p>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>

              <span>
                Ready for analysis
              </span>
            </div>

            <button
              type="button"
              className="remove-file"
              onClick={removeFile}
              disabled={loading}
              aria-label="Remove selected file"
            >
              <X size={18} />
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className="analyze-button"
        onClick={(event) => {
          event.stopPropagation();
          onAnalyze();
        }}
        disabled={!file || loading}
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
