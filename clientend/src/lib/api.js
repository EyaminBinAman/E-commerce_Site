export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: method === "GET" ? "no-store" : undefined,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
