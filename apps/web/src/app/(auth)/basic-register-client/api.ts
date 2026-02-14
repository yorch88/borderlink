const API_URL: string = import.meta.env.VITE_API_URL as string;

/* =========================
   Types
========================= */

export interface RegisterTenantPayload {
  email: string;
  password: string;
  giro: string;
  org_name: string;
  modules: string[];
  pow: {
    nonce: string;
    counter: number;
  };
}
export interface RegisterTenantResponse {
  client_code: string;
  db_name: string;
  status: string;
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

export async function registerTenant(
  payload: RegisterTenantPayload
): Promise<RegisterTenantResponse> {
  const response: Response = await fetch(
    `${API_URL}/v1/onboarding/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  const data: unknown = await response.json();

  if (!response.ok) {
    const errorData = data as ApiValidationError;

    throw new Error(
      errorData?.detail?.[0]?.msg || 'Error en registro'
    );
  }

  return data as RegisterTenantResponse;
}
