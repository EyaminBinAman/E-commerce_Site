import { getApiBaseUrl } from "@/lib/apiBaseUrl";

const FETCH_TIMEOUT_MS = 8000;

const resolveApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    return getApiBaseUrl();
  }

  return (
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3000/api/v1"
  ).replace(/\/+$/, "");
};

export const getAssetOrigin = () =>
  resolveApiBaseUrl().replace(/\/api\/v1\/?$/, "");

export const getBannerImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${getAssetOrigin()}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
};

export const mapBannerToSlide = (banner) => ({
  id: banner._id,
  src: getBannerImageUrl(banner.imageUrl),
  alt: banner.altText || banner.name,
  href: banner.linkUrl || null,
});

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    return await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchBanners(type) {
  try {
    const params = new URLSearchParams();
    if (type) {
      params.set("type", type);
    }

    const query = params.toString();
    const response = await fetchWithTimeout(
      `${resolveApiBaseUrl()}/banners/get-banners${query ? `?${query}` : ""}`
    );
    const data = await response.json();

    if (!response.ok || !data.success) {
      return [];
    }

    return data.banners || [];
  } catch {
    return [];
  }
}

export async function getBannersFromApi(type) {
  return fetchBanners(type);
}
