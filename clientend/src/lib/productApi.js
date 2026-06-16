import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import { getSubcategoryBySlug } from "@/lib/catalogUtils";

const FETCH_TIMEOUT_MS = 8000;

const apiOrigin = () => {
  const base = getApiBaseUrl();
  return base.replace(/\/api\/v1\/?$/, "");
};

export function getProductImageUrl(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return `${apiOrigin()}${src.startsWith("/") ? src : `/${src}`}`;
}

export function mapProductForListingCard(product) {
  const price =
    typeof product.discountPrice === "number"
      ? product.discountPrice
      : Number(product.price) || 0;
  const oldPrice =
    typeof product.discountPrice === "number" ? Number(product.price) || null : null;

  const badges = [];
  if (product.isOfferEnabled) badges.push("Sale");
  if (product.isFeatured) badges.push("New");

  const discount =
    product.discountPercentage > 0 ? `-${Math.round(product.discountPercentage)}%` : null;

  return {
    slug: product.slug,
    name: product.name,
    brand: product.brand?.name || "Brand",
    price,
    oldPrice,
    discount,
    badges,
    ratingCount: 0,
    imageUrl: getProductImageUrl(product.images?.[0]),
    emoji: "📦",
    isOutOfStock: !!product.isOutOfStock,
    animal: product.animal?.slug || product.animal || "",
    category: product.category || null,
    subcategory: product.category?.name || product.subcategory || "",
  };
}

export async function getProductsFromApi({
  brand,
  category,
  limit = 48,
  sort = "newest",
} = {}) {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const params = new URLSearchParams({
      isActive: "true",
      limit: String(limit),
      page: "1",
      sort,
    });

    if (brand) params.set("brand", brand);
    if (category) params.set("category", category);

    const response = await fetch(`${apiBaseUrl}/products/get-products?${params}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to load products");
    }

    return (data.products || []).map(mapProductForListingCard);
  } catch {
    return [];
  }
}

export async function getProductsForBrand(brandSlug, { limit = 48, sort = "newest" } = {}) {
  if (!brandSlug) return [];
  return getProductsFromApi({ brand: brandSlug, limit, sort });
}

export async function getProductsForCategory(
  categoryRef,
  { limit = 48, sort = "newest" } = {}
) {
  if (!categoryRef) return [];
  return getProductsFromApi({ category: categoryRef, limit, sort });
}

export async function getProductsForAnimalCategories(
  categorySlugs = [],
  { limit = 48, sort = "newest" } = {}
) {
  const slugs = [...new Set(categorySlugs.filter(Boolean))];
  if (!slugs.length) return [];

  const results = await Promise.all(
    slugs.map((slug) => getProductsForCategory(slug, { limit, sort }))
  );

  const seen = new Set();
  return results.flat().filter((product) => {
    if (!product.slug || seen.has(product.slug)) return false;
    seen.add(product.slug);
    return true;
  });
}

export async function getProductsForAnimalView(animal, subcategorySlug) {
  const activeSubcategory = getSubcategoryBySlug(animal, subcategorySlug);
  const isAllCategory = activeSubcategory === animal.categories[0];
  const categoryDetails = animal.categoryDetails || [];
  const activeCategory = categoryDetails.find((item) => item.name === activeSubcategory);

  if (isAllCategory) {
    const slugs = categoryDetails
      .filter((item) => !item.isAll && item.slug)
      .map((item) => item.slug);
    return getProductsForAnimalCategories(slugs);
  }

  if (activeCategory?.slug) {
    return getProductsForCategory(activeCategory.slug);
  }

  return getProductsForCategory(activeSubcategory);
}
