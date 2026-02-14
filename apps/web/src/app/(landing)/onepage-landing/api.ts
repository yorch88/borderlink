const API_URL: string = import.meta.env.VITE_API_URL as string;

/* =========================
   Types
========================= */

export interface LandingData {
  heroTitle?: string;
  heroSubtitle?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  features?: { title: string; description: string }[];
  contactTitle?: string;
  contactSubtitle?: string;
  privacyText?: string;
  footerText?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
  };
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  pow: {
    nonce: string;
    counter: number;
  };
}

export interface ContactResponse {
  success: boolean;
  message?: string;
}

interface ApiValidationError {
  detail?: {
    msg: string;
  }[];
}

/* =========================
   API
========================= */

export async function getLanding(): Promise<LandingData> {
  const response: Response = await fetch(
    `${API_URL}/v1/landing`
  );

  if (!response.ok) {
    throw new Error("Error cargando landing");
  }

  return response.json();
}

export async function sendContact(
  payload: ContactPayload
): Promise<ContactResponse> {
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
    const errorData = data as ApiValidationError;
    throw new Error(
      errorData?.detail?.[0]?.msg ||
        "Ocurrió un error al enviar tu mensaje."
    );
  }

  return data as ContactResponse;
}
