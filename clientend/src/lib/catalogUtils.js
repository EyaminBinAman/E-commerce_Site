export const slugifyCategory = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export function getSubcategoryBySlug(animal, subcategorySlug) {
  if (!animal?.categories?.length) return "";
  if (!subcategorySlug) return animal.categories[0];

  return (
    animal.categories.find((category) => slugifyCategory(category) === subcategorySlug) ||
    animal.categories[0]
  );
}
