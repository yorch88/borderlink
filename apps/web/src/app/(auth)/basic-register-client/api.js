const API_URL = import.meta.env.VITE_API_URL;

export async function registerTenant(payload) {
  const response = await fetch(`${API_URL}/v1/onboarding/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.detail?.[0]?.msg || 'Error en registro');
  }

  return response.json();
}
