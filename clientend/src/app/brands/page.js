import { redirect } from "next/navigation";

import { getBrandNavbarView } from "@/lib/brandApi";

export default async function BrandsPage() {
  const brands = await getBrandNavbarView();
  if (!brands.length) {
    redirect("/");
  }

  redirect(`/brands/${brands[0].slug}`);
}
