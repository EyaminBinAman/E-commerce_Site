import { animals as fallbackAnimals } from "@/data/categoryPageData";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

const emojiBySlug = {
  dog: "🐶",
  dogs: "🐶",
  cat: "🐱",
  cats: "🐱",
  fish: "🐠",
  bird: "🦜",
  birds: "🦜",
  rabbit: "🐰",
  "small-pets": "🐹",
  pharmacy: "💊",
};

const descBySlug = {
  dog: "Dog-first shopping for food, toys, grooming, beds, travel and health.",
  cat: "Everything for cats, from daily food and litter to toys and wellness essentials.",
  fish: "Aquarium care, filters, tanks, food and water treatment for healthy fishkeeping.",
  birds: "Bird cages, food, treats, perches, toys and care supplies for everyday comfort.",
  rabbit: "Rabbit nutrition, hay, bedding, habitats and comfort essentials.",
};

const titleCase = (value = "") =>
  value
    .toString()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

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

  if (!animals.length) {
    return fallbackAnimals;
  }

  const groupedCategories = categories.reduce((acc, item) => {
    const key = (item.animalName || "").trim().toLowerCase();
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item.name);
    return acc;
  }, {});

  // API returns newest first; show oldest first so the landing animal stays stable.
  const orderedAnimals = [...animals].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );

  const normalized = orderedAnimals.map((animal) => {
    const rawName = titleCase(animal.name || "Pet");
    const slug = animal.slug || rawName.toLowerCase();
    const groupKey = rawName.toLowerCase();
    const categoryList = groupedCategories[groupKey] || [];

    const allLabel = `All ${rawName}`;

    return {
      name: rawName,
      slug,
      icon: emojiBySlug[slug] || emojiBySlug[groupKey] || "🐾",
      description:
        descBySlug[slug] ||
        descBySlug[groupKey] ||
        `${rawName} essentials, nutrition, toys and care products in one place.`,
      categories: [allLabel, ...categoryList],
    };
  });

  return normalized.length ? normalized : fallbackAnimals;
}

export function findAnimalBySlug(animals, animalSlug = "") {
  const target = animalSlug.toString().trim().toLowerCase();
  if (!target) return null;

  // Tolerate singular/plural differences, e.g. "/categories/dogs" vs slug "dog".
  const variants = new Set([target]);
  if (target.endsWith("s")) variants.add(target.slice(0, -1));
  else variants.add(`${target}s`);

  return (
    animals.find((item) => variants.has((item.slug || "").toLowerCase())) ||
    animals.find((item) => variants.has((item.name || "").toLowerCase())) ||
    null
  );
}
