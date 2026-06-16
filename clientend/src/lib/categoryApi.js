import { slugifyCategory } from "@/lib/catalogUtils";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

const FETCH_TIMEOUT_MS = 5000;

export async function getAnimalsFromApi() {
  try {
    const response = await fetch(`${apiBaseUrl}/animals/get-animals`, {
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error("Failed to load animals");
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to load animals");
    }
    return data.animals || [];
  } catch {
    return [];
  }
}

export async function getCategoriesFromApi() {
  try {
    const response = await fetch(`${apiBaseUrl}/categories/get-categories`, {
      cache: "no-store",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error("Failed to load categories");
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to load categories");
    }
    return data.categories || [];
  } catch {
    return [];
  }
}

export async function getCategoryAnimalsView() {
  const [animals, categories] = await Promise.all([
    getAnimalsFromApi(),
    getCategoriesFromApi(),
  ]);

  const groupedCategories = categories.reduce((acc, item) => {
    const key = (item.animalName || "").trim().toLowerCase();
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push({
      name: item.name,
      slug: item.slug,
      icon: item.icon || "🐾",
      image: item.image || null,
    });
    return acc;
  }, {});

  const orderedAnimals = [...animals].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );

  return orderedAnimals.map((animal) => {
    const rawName = animal.name || "Pet";
    const slug = animal.slug || slugifyCategory(rawName);
    const categoryList = groupedCategories[rawName.toLowerCase()] || [];
    const allLabel = `All ${rawName}`;

    return {
      name: rawName,
      slug,
      icon: animal.icon || "🐾",
      description: animal.description || "",
      categories: [allLabel, ...categoryList.map((item) => item.name)],
      categoryDetails: [
        { name: allLabel, slug: null, isAll: true },
        ...categoryList.map((item) => ({
          name: item.name,
          slug: item.slug,
          icon: item.icon || "🐾",
          image: item.image || null,
          isAll: false,
        })),
      ],
    };
  });
}

export function findAnimalBySlug(animals, animalSlug = "") {
  const target = animalSlug.toString().trim().toLowerCase();
  if (!target) return null;

  const variants = new Set([target]);
  if (target.endsWith("s")) variants.add(target.slice(0, -1));
  else variants.add(`${target}s`);

  return (
    animals.find((item) => variants.has((item.slug || "").toLowerCase())) ||
    animals.find((item) => variants.has((item.name || "").toLowerCase())) ||
    null
  );
}
