import { redirect } from "next/navigation";

import { getBrandNavbarView } from "@/lib/brandApi";

export default async function BrandsPage() {
  const brands = await getBrandNavbarView();
  const fallbackSlug = brands[0]?.slug || "orijen";
  redirect(`/brands/${fallbackSlug}`);
}
