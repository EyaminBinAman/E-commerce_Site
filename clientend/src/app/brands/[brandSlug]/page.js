import { redirect } from "next/navigation";

import BrandPageContent from "@/components/brand/BrandPageContent";
import { findBrandBySlug, getBrandNavbarView } from "@/lib/brandApi";
import { getProductsForBrand } from "@/lib/productApi";

export default async function BrandPage({ params }) {
  const { brandSlug } = await params;
  const brands = await getBrandNavbarView();
  const brand = findBrandBySlug(brands, brandSlug);

  if (!brand) {
    redirect("/");
  }

  const products = await getProductsForBrand(brand.slug);

  return <BrandPageContent brand={brand} brands={brands} products={products} />;
}
