import { redirect } from "next/navigation";
import { getCategoryAnimalsView } from "@/lib/categoryApi";

export default async function CategoriesPage() {
  const animals = await getCategoryAnimalsView();
  const fallbackSlug = animals[0]?.slug || "dogs";
  redirect(`/categories/${fallbackSlug}`);
}
