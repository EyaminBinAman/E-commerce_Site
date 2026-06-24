import { redirect } from "next/navigation";

import CategoryPageContent from "@/components/category/CategoryPageContent";
import { findAnimalBySlug, getCategoryAnimalsView } from "@/lib/categoryApi";
import { getProductsForAnimalView } from "@/lib/productApi";

export async function generateStaticParams() {
  const animals = await getCategoryAnimalsView();
  return animals.map((animal) => ({
    animalSlug: animal.slug,
  }));
}

export default async function CategoryPage({ params, searchParams }) {
  const { animalSlug } = await params;
  const { sub } = await searchParams;
  const animals = await getCategoryAnimalsView();
  const animal = findAnimalBySlug(animals, animalSlug);

  if (!animal) {
    redirect("/");
  }

  const products = await getProductsForAnimalView(animal, sub);

  return <CategoryPageContent animal={animal} subcategorySlug={sub} products={products} />;
}
