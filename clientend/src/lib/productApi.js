import axios from "axios";

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
  const basePrice = Number(product.price) || 0;
  const activeVariants = (product.variants || []).filter(
    (variant) => variant.isActive !== false && (variant.value || variant.name)
  );

  let unitBasePrice =
    typeof product.discountPrice === "number" ? product.discountPrice : basePrice;
  let price = unitBasePrice;
  let stockQuantity = product.stockQuantity ?? 0;

  if (activeVariants.length) {
    const variantPrices = activeVariants.map(
      (variant) => unitBasePrice + Number(variant.priceAdjustment || 0)
    );
    price = Math.min(...variantPrices);
    stockQuantity = activeVariants.reduce(
      (total, variant) => total + Number(variant.stockQuantity || 0),
      0
    );
  }

  const oldPrice =
    typeof product.discountPrice === "number" ? basePrice : null;

  const badges = [];
  if (product.isOfferEnabled) badges.push("Sale");
  if (product.isFeatured) badges.push("New");

  const discount =
    product.discountPercentage > 0 ? `-${Math.round(product.discountPercentage)}%` : null;

  const variants = activeVariants.map((variant) => {
    const variantPrice = unitBasePrice + Number(variant.priceAdjustment || 0);
    const variantStock = Number(variant.stockQuantity || 0);

    return {
      _id: variant._id,
      label: variant.value || variant.name || "Option",
      price: variantPrice,
      stockQuantity: variantStock,
      isOutOfStock: variantStock <= 0,
    };
  });

  return {
    _id: product._id,
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
    stockQuantity,
    variants,
    hasVariants: variants.length > 0,
    isOutOfStock:
      variants.length > 0
        ? variants.every((variant) => variant.isOutOfStock)
        : !!product.isOutOfStock || stockQuantity <= 0,
    animal: product.animal?.slug || product.animal || "",
    category: product.category || null,
    subcategory: product.category?.name || product.subcategory || "",
  };
}

export async function getProductsFromApi({
  brand,
  category,
  search,
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
    if (search) params.set("search", search);

    const response = await axios.get(`${apiBaseUrl}/products/get-products?${params}`, {
      timeout: FETCH_TIMEOUT_MS,
    });
    const data = response.data;
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
