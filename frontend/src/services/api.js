const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function parseResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Request failed with status ${response.status}.`
    );
  }

  return data;
}

export async function predictMRI(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}

export async function getPreview(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/preview`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let detail = "";

    try {
      const data = await response.json();
      detail = data?.detail;
    } catch {
      detail = "";
    }

    throw new Error(
      detail ||
        `Request failed with status ${response.status}.`
    );
  }

  return response.blob();
}

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);

  return parseResponse(response);
}

export async function getModelInfo() {
  const response = await fetch(`${API_BASE_URL}/model-info`);

  return parseResponse(response);
}

export { API_BASE_URL };