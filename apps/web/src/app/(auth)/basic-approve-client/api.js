const API_URL = import.meta.env.VITE_API_URL;

export async function registerTenant(apiKey) {
    const response = await fetch(`${API_URL}/v1/onboarding/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: apiKey,   // 🔥 aquí está la corrección
      }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.detail?.[0]?.msg || 'Error en activación');
    }
  
    return response.json();
  }
  