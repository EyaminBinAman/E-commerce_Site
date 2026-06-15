import CategoryPageContent from "@/components/category/CategoryPageContent";
import { findAnimalBySlug, getCategoryAnimalsView } from "@/lib/categoryApi";

export default async function CategoryPage({ params, searchParams }) {
  const { animalSlug } = await params;
  const { sub } = await searchParams;
  const animals = await getCategoryAnimalsView();
  const animal =
    findAnimalBySlug(animals, animalSlug) ||
    animals[0] || {
      name: "Dogs",
      slug: "dogs",
      icon: "🐶",
      description: "Dog category products.",
      categories: ["All Dogs"],
    };

  return <CategoryPageContent animal={animal} subcategorySlug={sub} />;
}
