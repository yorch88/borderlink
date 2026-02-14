const API_URL: string = import.meta.env.VITE_API_URL as string;

/* =========================
   Types
========================= */

export interface ApproveTenantResponse {
  success: boolean;
  message: string;
  // ajustá esto a lo que realmente devuelve tu backend
}

interface ApiValidationError {
  detail?: {
    msg: string;
    loc?: string[];
    type?: string;
  }[];
}

/* =========================
   API
========================= */

export async function approveTenant(
  apiKey: string
): Promise<ApproveTenantResponse> {
  const response: Response = await fetch(
    `${API_URL}/v1/onboarding/approve`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: apiKey,
      }),
    }
  );

  const data: unknown = await response.json();

  if (!response.ok) {
    const errorData = data as ApiValidationError;

    throw new Error(
      errorData?.detail?.[0]?.msg || 'Error en activación'
    );
  }

  return data as ApproveTenantResponse;
}
