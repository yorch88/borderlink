const API_URL: string = import.meta.env.VITE_API_URL as string;

export function getToken(): string | null {
  return localStorage.getItem('access_token');
}

export function clearSession(): void {
  localStorage.removeItem('access_token');
}

export interface CurrentUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function validateSession(): Promise<CurrentUser> {
  const token = getToken();

  if (!token) {
    throw new Error('No token');
  }

  const response: Response = await fetch(`${API_URL}/v1/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Invalid session');
  }

  return response.json() as Promise<CurrentUser>;
}

export async function logoutSession(): Promise<void> {
  const token = getToken();

  if (token) {
    await fetch(`${API_URL}/v1/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  clearSession();
}
