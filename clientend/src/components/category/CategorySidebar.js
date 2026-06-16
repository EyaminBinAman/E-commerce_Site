import Image from "next/image";
import Link from "next/link";

import { slugifyCategory } from "@/lib/catalogUtils";
import { resolveCatalogImageUrl } from "@/lib/categoryApi";

export default function CategorySidebar({ animal, activeSubcategory, brands = [] }) {
  const normalizedBrands = brands
    .map((brand) => {
      if (typeof brand === "string") {
        return { key: brand, label: brand };
      }

      const label = brand?.name || brand?.slug || "";
      const key = brand?.slug || brand?._id || label;

      return label ? { key, label } : null;
    })
    .filter(Boolean);

  const categoryDetailsByName = (animal.categoryDetails || []).reduce((acc, item) => {
    acc[item.name] = item;
    return acc;
  }, {});

  return (
    <aside className="rounded-2xl bg-white p-6 shadow-[0_16px_45px_rgba(23,63,49,0.08)] lg:sticky lg:top-[12.5rem] lg:self-start">
      <h2 className="text-2xl font-black text-main">
        {animal.name} categories
      </h2>

      <nav className="mt-5 space-y-2">
        {animal.categories.map((category, index) => {
          const isActive = category === activeSubcategory;
          const href =
            index === 0
              ? `/categories/${animal.slug}`
              : `/categories/${animal.slug}?sub=${slugifyCategory(category)}`;
          const details = categoryDetailsByName[category];
          const imageUrl = resolveCatalogImageUrl(details?.image);

          return (
            <Link
              key={category}
              href={href}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-lg font-black text-main transition-colors ${
                isActive ? "bg-[#e6f3ec]" : "hover:bg-[#f4faf6]"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-mainSoft">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={category}
                    width={32}
                    height={32}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-base">{details?.icon || animal.icon || "🐾"}</span>
                )}
              </span>
              <span>{category}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-neutral-200 pt-7">
        <h3 className="text-lg font-black text-main">Price range</h3>
        <div className="mt-5 flex items-center justify-between text-base font-medium text-main/65">
          <span>$0</span>
          <span>$500</span>
        </div>
        <input
          type="range"
          min="0"
          max="500"
          defaultValue="500"
          className="mt-4 w-full accent-accent"
        />
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-7">
        <h3 className="text-lg font-black text-main">Brand</h3>
        <div className="mt-5 space-y-3">
          {normalizedBrands.map((brand) => (
            <label
              key={brand.key}
              className="flex items-center gap-3 text-base font-medium text-main/70"
            >
              <input type="checkbox" className="h-4 w-4 accent-main" />
              {brand.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-7">
        <h3 className="text-lg font-black text-main">Rating</h3>
        <div className="mt-5 space-y-3">
          {["All ratings", "5 stars only", "4 stars & up"].map((rating, index) => (
            <label
              key={rating}
              className="flex items-center gap-3 text-base font-medium text-main/70"
            >
              <input
                type="radio"
                name="rating"
                defaultChecked={index === 0}
                className="h-4 w-4 accent-main"
              />
              {rating}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-7">
        <h3 className="text-lg font-black text-main">Availability</h3>
        <label className="mt-5 flex items-center gap-3 text-base font-medium text-main/70">
          <input type="checkbox" className="h-4 w-4 accent-main" />
          In stock only
        </label>
      </div>
    </aside>
  );
}
