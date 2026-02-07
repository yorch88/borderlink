const API_URL = import.meta.env.VITE_API_URL;

export async function loginUser(payload) {
  const response = await fetch(`${API_URL}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.detail?.[0]?.msg || 'Credenciales inválidas');
  }

  return response.json();
}
