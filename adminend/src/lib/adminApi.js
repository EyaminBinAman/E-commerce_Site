import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export const adminClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
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

async function fetchAdminJson(path, options = {}) {
  try {
    const response = await adminClient(path, buildAxiosConfig(options));

    return {
      response: {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
      },
      data: response.data || {},
    };
  } catch (error) {
    if (error.code === "ECONNABORTED" || error.name === "AbortError") {
      throw new Error("Request timed out. Check that the backend is running.");
    }

    throw error;
  }
}

export async function adminApi(path, options = {}) {
  let { response, data } = await fetchAdminJson(path, options);

  if (
    response.status === 401 &&
    path !== "/users/admin-login" &&
    path !== "/users/logout" &&
    path !== "/users/refresh-token"
  ) {
    const refreshed = await fetchAdminJson("/users/refresh-token", {
      method: "POST",
    });

    if (refreshed.response.ok) {
      ({ response, data } = await fetchAdminJson(path, options));
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function getCurrentAdmin() {
  return adminApi("/users/me");
}

export function loginAdmin({ email, password }) {
  return adminApi("/users/admin-login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logoutAdmin() {
  return adminApi("/users/logout", {
    method: "POST",
  });
}
