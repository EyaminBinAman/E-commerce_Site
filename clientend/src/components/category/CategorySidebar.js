import Link from "next/link";

import { brands } from "@/data/categoryPageData";
import { slugifyCategory } from "@/data/categoryPageData";

export default function CategorySidebar({ animal, activeSubcategory }) {
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

          return (
            <Link
              key={category}
              href={href}
              className={`block w-full rounded-lg px-4 py-3 text-left text-lg font-black text-main transition-colors ${
                isActive ? "bg-[#e6f3ec]" : "hover:bg-[#f4faf6]"
              }`}
            >
              {category}
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
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 text-base font-medium text-main/70"
            >
              <input type="checkbox" className="h-4 w-4 accent-main" />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-7">
        <h3 className="text-lg font-black text-main">Rating</h3>
        <div className="mt-5 space-y-3">
          {["All ratings", "5 stars only", "4 stars & up"].map(
            (rating, index) => (
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
            )
          )}
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
