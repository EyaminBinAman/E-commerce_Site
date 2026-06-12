export const mockOrders = [
  {
    id: "ORD-2026-0142",
    date: "May 18, 2026",
    status: "Delivered",
    itemsCount: 4,
    total: 4250,
    products: [
      "Royal Canin Adult Dog Food 3kg",
      "Squeaky Bone Toy",
      "Reflective Dog Collar",
      "Chicken Training Treats",
    ],
  },
  {
    id: "ORD-2026-0139",
    date: "May 12, 2026",
    status: "In Transit",
    itemsCount: 2,
    total: 1850,
    products: ["Clumping Cat Litter 5kg", "Catnip Mouse Toy"],
  },
  {
    id: "ORD-2026-0131",
    date: "May 04, 2026",
    status: "Processing",
    itemsCount: 1,
    total: 1199,
    products: ["Frontline Flea Treatment (Medium Dog)"],
  },
  {
    id: "ORD-2026-0125",
    date: "April 28, 2026",
    status: "Delivered",
    itemsCount: 3,
    total: 3120,
    products: ["Premium Fish Flakes", "Aquarium Filter", "Fine Mesh Fish Net"],
  },
  {
    id: "ORD-2026-0118",
    date: "April 15, 2026",
    status: "Cancelled",
    itemsCount: 1,
    total: 950,
    products: ["Outdoor Bird Cage Cover"],
  },
];

export const mockAddresses = [
  {
    id: "a_home",
    label: "Home",
    name: "Test Pet Parent",
    phone: "+880 1712-345678",
    line: "House 42, Road 11, Block B",
    area: "Banani",
    city: "Dhaka",
    postal: "1213",
    isDefault: true,
  },
  {
    id: "a_office",
    label: "Office",
    name: "Test Pet Parent",
    phone: "+880 1712-345678",
    line: "Level 5, Plot 8, Gulshan Avenue",
    area: "Gulshan-1",
    city: "Dhaka",
    postal: "1212",
    isDefault: false,
  },
];

export const mockPets = [
  {
    id: "pet_buddy",
    name: "Buddy",
    type: "Dog",
    breed: "Golden Retriever",
    age: "3 years",
    weight: "28 kg",
    color: "main",
  },
  {
    id: "pet_whiskers",
    name: "Whiskers",
    type: "Cat",
    breed: "Persian",
    age: "2 years",
    weight: "4.2 kg",
    color: "accent",
  },
  {
    id: "pet_bubbles",
    name: "Bubbles",
    type: "Fish",
    breed: "Goldfish",
    age: "1 year",
    weight: "—",
    color: "main",
  },
];

export const mockWishlist = [
  {
    id: "wl_1",
    name: "Memory Foam Dog Bed (Large)",
    category: "Dogs",
    price: 3500,
    inStock: true,
  },
  {
    id: "wl_2",
    name: "Tall Sisal Cat Scratch Post",
    category: "Cats",
    price: 1800,
    inStock: true,
  },
  {
    id: "wl_3",
    name: "Aquarium LED Light Bar 60cm",
    category: "Fish",
    price: 2400,
    inStock: false,
  },
  {
    id: "wl_4",
    name: "Hanging Bird Feeding Station",
    category: "Birds",
    price: 1200,
    inStock: true,
  },
];

export const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-sky-100 text-sky-700",
  Delivered: "bg-mainSoft text-main",
  "In Transit": "bg-accent/15 text-accent",
  Shipped: "bg-accent/15 text-accent",
  Processing: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
};

export function formatBDT(amount) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name) {
  return (name || "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
