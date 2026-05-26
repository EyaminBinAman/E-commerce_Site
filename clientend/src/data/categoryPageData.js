export const animals = [
  {
    name: "Dogs",
    slug: "dogs",
    icon: "🐶",
    description:
      "Dog-first shopping for food, toys, grooming, beds, travel and health. Explore nutrition, play, comfort and preventive care for every stage of a dog's life.",
    categories: [
      "All Dogs",
      "Dog Food",
      "Dog Treats",
      "Dog Toys",
      "Dog Grooming",
      "Dog Medicine",
      "Dog Beds",
      "Dog Leash & Harness",
      "Dog Bowls & Feeders",
      "Dog Accessories",
      "Dog Travel",
    ],
  },
  {
    name: "Cats",
    slug: "cats",
    icon: "🐱",
    description:
      "Everything for cats, from daily food and litter to toys, trees, grooming and wellness essentials.",
    categories: [
      "All Cats",
      "Cat Food",
      "Cat Litter",
      "Cat Treats",
      "Cat Toys",
      "Cat Trees",
      "Cat Grooming",
      "Cat Medicine",
    ],
  },
  {
    name: "Fish",
    slug: "fish",
    icon: "🐠",
    description:
      "Aquarium care, filters, tanks, food and water treatment for healthy fishkeeping.",
    categories: [
      "All Fish",
      "Fish Food",
      "Aquariums",
      "Filters",
      "Water Care",
      "Decor",
      "Lighting",
    ],
  },
  {
    name: "Birds",
    slug: "birds",
    icon: "🦜",
    description:
      "Bird cages, food, treats, perches, toys and care supplies for everyday comfort.",
    categories: [
      "All Birds",
      "Bird Food",
      "Bird Cages",
      "Perches",
      "Bird Toys",
      "Treats",
    ],
  },
  {
    name: "Small Pets",
    slug: "small-pets",
    icon: "🐹",
    description:
      "Hay, bedding, habitats, bowls and toys for rabbits, hamsters, guinea pigs and more.",
    categories: [
      "All Small Pets",
      "Rabbit Food",
      "Hay",
      "Bedding",
      "Habitats",
      "Small Pet Toys",
    ],
  },
  {
    name: "Pharmacy",
    slug: "pharmacy",
    icon: "💊",
    description:
      "Health, prevention, vitamins and care products organized around your pet's needs.",
    categories: [
      "All Pharmacy",
      "Flea & Tick",
      "Vitamins",
      "Dental Care",
      "Eye & Ear",
      "Skin & Coat",
    ],
  },
];

export const products = [
  {
    name: "Original Grain-Free Adult Dry Dog Food",
    brand: "Orijen",
    category: "dogs",
    subcategory: "Dog Food",
    emoji: "🥩",
    price: 68.99,
    oldPrice: 84.99,
    discount: "19% off",
    ratingCount: "4,812",
    badges: ["Sale", "Autoship"],
  },
  {
    name: "Mini Natural Training Dog Treats",
    brand: "Zuke's",
    category: "dogs",
    subcategory: "Dog Treats",
    emoji: "🦴",
    price: 7.99,
    ratingCount: "6,700",
    badges: ["Autoship"],
  },
  {
    name: "Classic Extreme Rubber Chew Toy",
    brand: "KONG",
    category: "dogs",
    subcategory: "Dog Toys",
    emoji: "🎾",
    price: 14.99,
    oldPrice: 18.99,
    discount: "21% off",
    ratingCount: "9,204",
    badges: ["Sale"],
  },
  {
    name: "Orthopedic Memory Foam Sofa Dog Bed",
    brand: "Furhaven",
    category: "dogs",
    subcategory: "Dog Beds",
    emoji: "💊",
    price: 44.95,
    oldPrice: 59.99,
    discount: "25% off",
    ratingCount: "3,872",
    badges: ["Sale", "Autoship"],
  },
  {
    name: "Puppy Chicken & Barley Wet Food Tray Pack",
    brand: "Hill's Science Diet",
    category: "dogs",
    subcategory: "Dog Food",
    emoji: "🐕‍🦺",
    price: 24.99,
    ratingCount: "2,314",
    badges: [],
  },
  {
    name: "Stainless Steel Water Bowl",
    brand: "Burt's Bees",
    category: "dogs",
    subcategory: "Dog Bowls & Feeders",
    emoji: "🛁",
    price: 16.95,
    ratingCount: "2,980",
    badges: ["Sale"],
  },
  {
    name: "Dog Car Seat Cover Hammock",
    brand: "Kurgo",
    category: "dogs",
    subcategory: "Dog Travel",
    emoji: "🚗",
    price: 42.0,
    ratingCount: "1,810",
    badges: ["New"],
  },
  {
    name: "Indoor Adult Cat Food",
    brand: "Royal Canin",
    category: "cats",
    subcategory: "Cat Food",
    emoji: "🐟",
    price: 36.5,
    oldPrice: 42.0,
    discount: "13% off",
    ratingCount: "5,402",
    badges: ["Sale"],
  },
  {
    name: "Clumping Multi-Cat Litter",
    brand: "Fresh Step",
    category: "cats",
    subcategory: "Cat Litter",
    emoji: "🧺",
    price: 19.95,
    ratingCount: "8,121",
    badges: ["Autoship"],
  },
  {
    name: "Aquarium Power Filter",
    brand: "Fluval",
    category: "fish",
    subcategory: "Filters",
    emoji: "🌊",
    price: 29.99,
    ratingCount: "1,421",
    badges: ["New"],
  },
];

export const brands = [
  "Orijen",
  "Hill's Science Diet",
  "Zuke's",
  "KONG",
  "Burt's Bees",
  "NexGard",
];

export function getAnimalBySlug(slug) {
  return animals.find((animal) => animal.slug === slug) || animals[0];
}

export function slugifyCategory(value = "") {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getSubcategoryBySlug(animal, subcategorySlug) {
  if (!subcategorySlug) return animal.categories[0];

  return (
    animal.categories.find(
      (category) => slugifyCategory(category) === subcategorySlug
    ) || animal.categories[0]
  );
}
