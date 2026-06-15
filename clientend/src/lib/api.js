export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

async function fetchJson(path, options = {}) {
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

  return { response, data };
}

export async function apiRequest(path, options = {}) {
  let { response, data } = await fetchJson(path, options);

  if (
    response.status === 401 &&
    path !== "/users/login" &&
    path !== "/users/logout" &&
    path !== "/users/refresh-token"
  ) {
    const refreshed = await fetchJson("/users/refresh-token", {
      method: "POST",
    });

    if (refreshed.response.ok) {
      ({ response, data } = await fetchJson(path, options));
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
