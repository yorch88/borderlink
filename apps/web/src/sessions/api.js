const API_URL = import.meta.env.VITE_API_URL;

export function getToken() {
  return localStorage.getItem('access_token');
}

export function clearSession() {
  localStorage.removeItem('access_token');
}

export async function validateSession() {
  const token = getToken();

  if (!token) {
    throw new Error('No token');
  }

  const response = await fetch(`${API_URL}/v1/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Invalid session');
  }

  return response.json();
}

export async function logoutSession() {
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
