import Image from "next/image";
import Link from "next/link";

function BrandInitials({ name }) {
  return (
    <span className="text-[10px] font-black text-main">
      {(name || "?")
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()}
    </span>
  );
}

export default function BrandSidebar({ brands, activeBrand }) {
  return (
    <aside className="rounded-2xl bg-white p-6 shadow-[0_16px_45px_rgba(23,63,49,0.08)] lg:sticky lg:top-[12.5rem] lg:self-start">
      <h2 className="text-2xl font-black text-main">Shop by brand</h2>

      <nav className="mt-5 space-y-2">
        {brands.map((brand) => {
          const isActive = brand.slug === activeBrand.slug;

          return (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-lg font-black text-main transition-colors ${
                isActive ? "bg-[#e6f3ec]" : "hover:bg-[#f4faf6]"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#eef8f2]">
                {brand.imageUrl ? (
                  <Image
                    src={brand.imageUrl}
                    alt={brand.name}
                    width={32}
                    height={32}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BrandInitials name={brand.name} />
                )}
              </span>
              {brand.name}
            </Link>
          );
        })}
      </nav>

      {activeBrand.animalNames?.length ? (
        <div className="mt-8 border-t border-neutral-200 pt-7">
          <h3 className="text-lg font-black text-main">Pet types</h3>
          <div className="mt-5 flex flex-wrap gap-2">
            {activeBrand.animalNames.map((animal) => (
              <span
                key={animal}
                className="rounded-full bg-[#eef8f2] px-3 py-1.5 text-sm font-black text-main"
              >
                {animal}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
