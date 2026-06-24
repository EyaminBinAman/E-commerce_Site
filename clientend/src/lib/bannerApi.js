import axios from "axios";

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

export const mapBannerToSlide = (banner) => {
  if (!banner?.imageUrl) {
    return null;
  }

  return {
    id: banner._id || banner.id,
    src: getBannerImageUrl(banner.imageUrl),
    alt: banner.altText || banner.name || "Banner",
    href: banner.linkUrl || null,
    slideNumber: Number(banner.slideNumber) || 0,
  };
};

const sortBanners = (banners = []) =>
  [...banners].sort(
    (left, right) =>
      Number(left.slideNumber) - Number(right.slideNumber) ||
      new Date(left.createdAt || 0) - new Date(right.createdAt || 0)
  );

export async function fetchHeroBanners() {
  return sortBanners(await fetchBanners("hero-banner"));
}

export async function fetchSliderBanners() {
  return sortBanners(await fetchBanners("slider-banner"));
}

export async function fetchBanners(type) {
  try {
    const params = new URLSearchParams();
    if (type) {
      params.set("type", type);
    }

    const query = params.toString();
    const response = await axios.get(
      `${resolveApiBaseUrl()}/banners/get-banners${query ? `?${query}` : ""}`,
      { timeout: FETCH_TIMEOUT_MS }
    );
    const data = response.data;

    if (!data.success) {
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
