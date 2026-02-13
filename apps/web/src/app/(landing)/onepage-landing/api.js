const API_URL = import.meta.env.VITE_API_URL;

export async function getLanding() {
  const response = await fetch(`${API_URL}/v1/landing`);

  if (!response.ok) {
    throw new Error("Error cargando landing");
  }

  return response.json();
}

export async function sendContact(payload) {
  const response = await fetch(`${API_URL}/v1/landing/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || "Error enviando mensaje");
  }

  return data;
}
