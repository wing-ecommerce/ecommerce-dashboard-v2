// helper to call backend with JWT token
export async function apiFetch(endpoint: string, options: any = {}) {
  const token = localStorage.getItem("token");
  const baseUrl = process.env.API_BASE_URL;

  const res = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "API Error");
  }

  return res.json();
}
