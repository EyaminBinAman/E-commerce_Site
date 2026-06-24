import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  validateStatus: () => true,
});

function buildAxiosConfig(options = {}) {
  const { body, headers, signal, method = "GET", ...rest } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  return {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(headers || {}),
    },
    data: isFormData || typeof body !== "string" ? body : body ? JSON.parse(body) : undefined,
    signal,
    ...rest,
  };
}

async function fetchJson(path, options = {}) {
  const response = await apiClient(path, buildAxiosConfig(options));

  return {
    response: {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
    },
    data: response.data || {},
  };
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
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}
