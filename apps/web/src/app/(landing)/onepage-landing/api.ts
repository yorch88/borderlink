const API_URL: string = import.meta.env.VITE_API_URL as string;

/* =========================
   Types
========================= */

export interface LandingData {
  title: string;
  subtitle: string;
  content: string;
  // ajustalo a lo que realmente devuelve tu backend
}

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface ApiErrorResponse {
  detail?: string;
}

/* =========================
   API
========================= */

export async function getLanding(): Promise<LandingData> {
  const response: Response = await fetch(`${API_URL}/v1/landing`);

  if (!response.ok) {
    throw new Error("Error cargando landing");
  }

  return response.json() as Promise<LandingData>;
}

export async function sendContact(
  payload: ContactPayload
): Promise<{ success: boolean; message: string }> {
  const response: Response = await fetch(
    `${API_URL}/v1/landing/contact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data: unknown = await response.json();

  if (!response.ok) {
    const errorData = data as ApiErrorResponse;
    throw new Error(errorData?.detail || "Error enviando mensaje");
  }

  return data as { success: boolean; message: string };
}
