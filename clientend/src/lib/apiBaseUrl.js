const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

export const getApiBaseUrl = () => {
  const envBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envBaseUrl) {
    return trimTrailingSlash(envBaseUrl);
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:3000/api/v1`;
  }

  return "http://localhost:3000/api/v1";
};
