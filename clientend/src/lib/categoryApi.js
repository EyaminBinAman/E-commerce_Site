import axios from "axios";

import { slugifyCategory, getAnimalGroupKeys } from "@/lib/catalogUtils";
import { getAssetOrigin } from "@/lib/bannerApi";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

const FETCH_TIMEOUT_MS = 5000;

export function resolveCatalogImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${getAssetOrigin()}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
}

export async function getAnimalsFromApi() {
  try {
    const response = await axios.get(`${apiBaseUrl}/animals/get-animals`, {
      timeout: FETCH_TIMEOUT_MS,
    });
    const data = response.data;
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
    const response = await axios.get(`${apiBaseUrl}/categories/get-categories`, {
      timeout: FETCH_TIMEOUT_MS,
    });
    const data = response.data;
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
    const categoryList = getAnimalGroupKeys(rawName).flatMap(
      (key) => groupedCategories[key] || []
    );
    const uniqueCategories = categoryList.filter(
      (item, index, list) =>
        list.findIndex((entry) => entry.slug === item.slug) === index
    );
    const allLabel = `All ${rawName}`;

    return {
      name: rawName,
      slug,
      icon: animal.icon || "🐾",
      image: animal.image || null,
      imageUrl: resolveCatalogImageUrl(animal.image),
      description: animal.description || "",
      categories: [allLabel, ...uniqueCategories.map((item) => item.name)],
      categoryDetails: [
        { name: allLabel, slug: null, isAll: true, icon: animal.icon || "🐾", image: animal.image || null },
        ...uniqueCategories.map((item) => ({
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
