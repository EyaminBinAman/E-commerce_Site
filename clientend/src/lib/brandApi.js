import { getApiBaseUrl } from "@/lib/apiBaseUrl";

const FETCH_TIMEOUT_MS = 5000;

const titleCase = (value = "") =>
  value
    .toString()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export async function getBrandsFromApi() {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/brands/get-brands`, {
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error("Failed to load brands");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to load brands");
    }

    return data.brands || [];
  } catch {
    return [];
  }
}

export async function getBrandNavbarView() {
  const brands = await getBrandsFromApi();

  const ordered = [...brands].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );

  return ordered.map((brand) => {
    const name = titleCase(brand.name || "Brand");
    const animals = (brand.animalNames || []).filter(Boolean);

    return {
      _id: brand._id,
      name,
      slug: brand.slug || name.toLowerCase().replace(/\s+/g, "-"),
      description:
        animals.length > 0
          ? `${animals.join(", ")} essentials`
          : `${name} products and pet care essentials`,
      animalNames: animals,
      image: brand.image || null,
    };
  });
}

export function findBrandBySlug(brands, brandSlug = "") {
  const target = brandSlug.toString().trim().toLowerCase();
  if (!target) return null;

  return (
    brands.find((item) => (item.slug || "").toLowerCase() === target) ||
    brands.find((item) => (item.name || "").toLowerCase() === target) ||
    null
  );
}
