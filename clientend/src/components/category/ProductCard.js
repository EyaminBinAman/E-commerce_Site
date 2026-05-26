import { HiOutlineHeart } from "react-icons/hi2";

const badgeClassNames = {
  Sale: "bg-red-600 text-white",
  Autoship: "bg-main text-white",
  New: "bg-accent text-white",
};

export default function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_45px_rgba(23,63,49,0.08)]">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-b from-white to-[#fbf7f1]">
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {product.badges.map((badge) => (
            <span
              key={badge}
              className={`rounded-full px-4 py-2 text-xs font-black ${
                badgeClassNames[badge] || "bg-main text-white"
              }`}
            >
              {badge}
            </span>
          ))}
        </div>
        <span className="text-6xl">{product.emoji}</span>
      </div>

      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
          {product.brand}
        </p>
        <h3 className="mt-2 min-h-14 text-lg font-black leading-7 text-main">
          {product.name}
        </h3>

        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-accent">★★★★★</span>
          <span className="font-medium text-main/60">
            ({product.ratingCount})
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <span className="text-3xl font-black text-main">
            ${product.price.toFixed(2)}
          </span>
          {product.oldPrice ? (
            <span className="text-sm font-bold text-main/50 line-through">
              ${product.oldPrice.toFixed(2)}
            </span>
          ) : null}
          {product.discount ? (
            <span className="text-sm font-black text-red-600">
              {product.discount}
            </span>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-[3.25rem_1fr] gap-3">
          <button
            type="button"
            aria-label={`Add ${product.name} to wishlist`}
            className="flex h-12 items-center justify-center rounded-lg border border-neutral-200 text-xl text-main transition-colors hover:border-main"
          >
            <HiOutlineHeart />
          </button>
          <button
            type="button"
            className="h-12 rounded-lg bg-main text-base font-black text-white transition-colors hover:bg-main/90"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
