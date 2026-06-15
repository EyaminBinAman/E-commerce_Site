require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../src/config/db");
const Animal = require("../src/models/Animal");
const Brand = require("../src/models/Brand");
const Category = require("../src/models/Category");
const Product = require("../src/models/Product");

const animals = [
  { name: "Dog", slug: "dog" },
  { name: "Cat", slug: "cat" },
  { name: "Fish", slug: "fish" },
  { name: "Bird", slug: "bird" },
  { name: "Rabbit", slug: "rabbit" },
];

const brands = [
  { name: "Smart Hear", animalNames: ["Cat"] },
  { name: "Paw Pro", animalNames: ["Dog"] },
  { name: "AquaNest", animalNames: ["Fish"] },
  { name: "FeatherFlex", animalNames: ["Bird"] },
  { name: "BunnyBite", animalNames: ["Rabbit"] },
];

const categories = [
  { name: "Dog Food", animalName: "Dog" },
  { name: "Cat Food", animalName: "Cat" },
  { name: "Fish Care", animalName: "Fish" },
  { name: "Bird Toys", animalName: "Bird" },
  { name: "Rabbit Hay", animalName: "Rabbit" },
];

const products = [
  {
    name: "Premium Cat Food Tuna",
    description: "A protein-rich dry food for active adult cats.",
    categoryName: "Cat Food",
    animalName: "Cat",
    brandName: "Smart Hear",
    price: 650,
    discountPrice: 550,
    stockQuantity: 24,
    isFeatured: true,
    tags: ["cat", "food", "premium"],
  },
  {
    name: "Dog Food Basic Plus",
    description: "Balanced everyday nutrition for adult dogs.",
    categoryName: "Dog Food",
    animalName: "Dog",
    brandName: "Paw Pro",
    price: 1200,
    discountPrice: 950,
    stockQuantity: 18,
    isFeatured: true,
    tags: ["dog", "food"],
  },
  {
    name: "Gold Fish Starter Pack",
    description: "Starter bundle for a clean and healthy aquarium setup.",
    categoryName: "Fish Care",
    animalName: "Fish",
    brandName: "AquaNest",
    price: 345,
    stockQuantity: 32,
    tags: ["fish", "aquarium"],
  },
  {
    name: "Parrot Activity Toys",
    description: "Colorful hanging toys that keep parrots engaged.",
    categoryName: "Bird Toys",
    animalName: "Bird",
    brandName: "FeatherFlex",
    price: 480,
    discountPrice: 420,
    stockQuantity: 15,
    isFeatured: true,
    tags: ["bird", "toy"],
  },
  {
    name: "Rabbit Hay Bundle",
    description: "Soft, fresh hay with high fiber for daily feeding.",
    categoryName: "Rabbit Hay",
    animalName: "Rabbit",
    brandName: "BunnyBite",
    price: 390,
    stockQuantity: 21,
    tags: ["rabbit", "hay"],
  },
  {
    name: "Cat Litter Fresh Pack",
    description: "Low-dust clumping litter with odor control.",
    categoryName: "Cat Food",
    animalName: "Cat",
    brandName: "Smart Hear",
    price: 750,
    discountPrice: 650,
    stockQuantity: 28,
    tags: ["cat", "litter"],
  },
];

async function ensureAnimal(data) {
  const existing = await mongoose.connection.collection("animals").findOne({
    slug: data.slug,
  });
  if (existing) {
    return existing;
  }

  return Animal.create(data);
}

async function ensureBrand(data) {
  const existing = await mongoose.connection.collection("brands").findOne({
    name: data.name,
  });
  if (existing) {
    return existing;
  }

  return Brand.create(data);
}

async function ensureCategory(data) {
  const existing = await mongoose.connection.collection("categories").findOne({
    name: data.name,
  });
  if (existing) {
    return existing;
  }

  return Category.create(data);
}

async function ensureProduct(data, refs) {
  const existing = await mongoose.connection.collection("products").findOne({
    name: data.name,
  });
  if (existing) {
    return existing;
  }

  return Product.create({
    name: data.name,
    description: data.description,
    category: refs.category._id,
    animal: refs.animal._id,
    brand: refs.brand._id,
    price: data.price,
    discountPrice: data.discountPrice ?? null,
    stockQuantity: data.stockQuantity,
    isActive: true,
    isDeleted: false,
    isFeatured: !!data.isFeatured,
    tags: data.tags,
    images: data.images || [],
  });
}

async function main() {
  try {
    await connectDB();

    const animalMap = new Map();
    for (const item of animals) {
      const animal = await ensureAnimal(item);
      animalMap.set(item.name, animal);
    }

    const brandMap = new Map();
    for (const item of brands) {
      const brand = await ensureBrand(item);
      brandMap.set(item.name, brand);
    }

    const categoryMap = new Map();
    for (const item of categories) {
      const category = await ensureCategory(item);
      categoryMap.set(item.name, category);
    }

    for (const item of products) {
      const refs = {
        animal: animalMap.get(item.animalName),
        brand: brandMap.get(item.brandName),
        category: categoryMap.get(item.categoryName),
      };

      if (!refs.animal || !refs.brand || !refs.category) {
        throw new Error(`Missing reference for product: ${item.name}`);
      }

      await ensureProduct(item, refs);
    }

    console.log("Demo products seeded successfully.");
  } catch (error) {
    console.error("Demo product seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => undefined);
  }
}

main();
