import CategoryPageContent from "@/components/category/CategoryPageContent";
import { animals, getAnimalBySlug } from "@/data/categoryPageData";

export function generateStaticParams() {
  return animals.map((animal) => ({
    animalSlug: animal.slug,
  }));
}

export default async function CategoryPage({ params, searchParams }) {
  const { animalSlug } = await params;
  const { sub } = await searchParams;
  const animal = getAnimalBySlug(animalSlug);

  return <CategoryPageContent animal={animal} subcategorySlug={sub} />;
}
