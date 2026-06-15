import CategoryPageContent from "@/components/category/CategoryPageContent";
import { API_BASE_URL } from "@/lib/api";
import { animals as fallbackAnimals } from "@/data/categoryPageData";

async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}`);
  }

  return response.json();
}

function buildAnimalFromFallback(slug) {
  const safeSlug = String(slug || "category");
  const normalizedSlug = safeSlug.toLowerCase();
  const match = fallbackAnimals.find((animal) => {
    const animalSlug = String(animal.slug || "").toLowerCase();
    return animalSlug === normalizedSlug || animalSlug.replace(/s$/, "") === normalizedSlug.replace(/s$/, "");
  });
  if (!match) {
    const title = safeSlug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    return {
      name: title,
      slug,
      icon: "🐾",
      description: `Explore products and categories for ${title.toLowerCase()}.`,
      categories: [`All ${title}`],
    };
  }

  return {
    ...match,
    categories: [`All ${match.name}`, ...(match.categories || []).slice(1)],
  };
}

export async function generateStaticParams() {
  try {
    const data = await fetchJson("/animals/get-animals");
    return (data.animals || []).map((animal) => ({
      animalSlug: animal.slug,
    }));
  } catch (_error) {
    return fallbackAnimals.map((animal) => ({
      animalSlug: animal.slug,
    }));
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const { animalSlug } = params;
  const sub = searchParams?.sub;

  const [animalData, categoryData, brandData, productData] = await Promise.all([
    fetchJson("/animals/get-animals").catch(() => ({ animals: [] })),
    fetchJson("/categories/get-categories").catch(() => ({ categories: [] })),
    fetchJson("/brands/get-brands").catch(() => ({ brands: [] })),
    fetchJson(`/products/get-products?animal=${encodeURIComponent(animalSlug)}&limit=100`).catch(
      () => ({ products: [] })
    ),
  ]);

  const backendAnimal = (animalData.animals || []).find(
    (animal) => {
      const currentSlug = String(animal?.slug || "").toLowerCase();
      const requestedSlug = String(animalSlug || "").toLowerCase();
      return (
        currentSlug === requestedSlug ||
        currentSlug.replace(/s$/, "") === requestedSlug.replace(/s$/, "")
      );
    }
  );

  const fallbackAnimal = buildAnimalFromFallback(animalSlug);

  const baseAnimal = backendAnimal || fallbackAnimal;
  const baseAnimalName = baseAnimal?.name || String(animalSlug || "Category");
  const baseAnimalSlug = baseAnimal?.slug || String(animalSlug || "category");
  const categoriesForAnimal = (categoryData.categories || [])
    .filter((category) => category.animalName?.toLowerCase() === baseAnimalName.toLowerCase())
    .map((category) => category.name);

  const animal = {
    ...baseAnimal,
    name: baseAnimalName,
    slug: baseAnimalSlug,
    categories: [`All ${baseAnimalName}`, ...categoriesForAnimal],
  };

  return (
    <CategoryPageContent
      animal={animal}
      subcategorySlug={sub}
      products={productData.products || []}
      brands={brandData.brands || []}
    />
  );
}
