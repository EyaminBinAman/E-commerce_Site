import Image from "next/image";
import Link from "next/link";
import { HiOutlineHeart } from "react-icons/hi2";

const badgeClassNames = {
  Sale: "bg-red-600 text-white",
  Autoship: "bg-main text-white",
  New: "bg-accent text-white",
};

const formatPrice = (value) => {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ProductCard({ product }) {
  const productHref = product.slug ? `/product/${product.slug}` : null;

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_45px_rgba(23,63,49,0.08)] transition-transform duration-300 hover:-translate-y-1">
      {productHref ? (
        <Link href={productHref} className="block">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#fbf7f1]">
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {(product.badges || []).map((badge) => (
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
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                unoptimized
                className="object-contain p-6"
              />
            ) : (
              <span className="text-6xl">{product.emoji || "📦"}</span>
            )}
          </div>
        </Link>
      ) : (
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-b from-white to-[#fbf7f1]">
          <span className="text-6xl">{product.emoji || "📦"}</span>
        </div>
      )}

      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
          {product.brand}
        </p>
        {productHref ? (
          <Link href={productHref}>
            <h3 className="mt-2 min-h-14 text-lg font-black leading-7 text-main transition-colors hover:text-main/80">
              {product.name}
            </h3>
          </Link>
        ) : (
          <h3 className="mt-2 min-h-14 text-lg font-black leading-7 text-main">
            {product.name}
          </h3>
        )}

        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-accent">★★★★★</span>
          <span className="font-medium text-main/60">
            ({product.ratingCount || 0})
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <span className="text-3xl font-black text-main">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice ? (
            <span className="text-sm font-bold text-main/50 line-through">
              {formatPrice(product.oldPrice)}
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
          {productHref ? (
            <Link
              href={productHref}
              className="flex h-12 items-center justify-center rounded-lg bg-main text-base font-black text-white transition-colors hover:bg-main/90"
            >
              {product.isOutOfStock ? "Out of stock" : "View"}
            </Link>
          ) : (
            <button
              type="button"
              className="h-12 rounded-lg bg-main text-base font-black text-white transition-colors hover:bg-main/90"
            >
              View
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
