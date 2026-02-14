const API_URL: string = import.meta.env.VITE_API_URL as string;

/* =========================
   Types
========================= */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
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

export async function loginUser(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response: Response = await fetch(
    `${API_URL}/v1/auth/login`,
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
      errorData?.detail?.[0]?.msg || 'Credenciales inválidas'
    );
  }

  return data as LoginResponse;
}
