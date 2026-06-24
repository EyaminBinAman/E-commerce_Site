"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineHeart, HiOutlineShoppingBag } from "react-icons/hi2";

import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";

const badgeClassNames = {
  Sale: "bg-red-600 text-white",
  Autoship: "bg-main text-white",
  New: "bg-accent text-white",
};

function formatPrice(value) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState(() => {
    const firstAvailable =
      product.variants?.find((variant) => !variant.isOutOfStock) || product.variants?.[0];
    return firstAvailable?._id || "";
  });

  const productId = product._id || null;
  const productSlug = product.slug || "";
  const isWishlistedNow = productId ? isWishlisted(productId) : false;
  const selectedVariant =
    product.variants?.find((variant) => variant._id === selectedVariantId) || null;
  const displayPrice = selectedVariant?.price ?? product.price;
  const displayStock = selectedVariant?.stockQuantity ?? product.stockQuantity ?? 0;
  const isOutOfStock = selectedVariant
    ? selectedVariant.isOutOfStock
    : product.isOutOfStock;

  const handleWishlist = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!productId) {
      setMessage("Product is not ready yet");
      return;
    }

    try {
      await toggleWishlist(product);
      setMessage(isWishlistedNow ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      setMessage(error.message || "Wishlist failed");
    }
  };

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!productId) {
      setMessage("Product is not ready yet");
      return;
    }

    if (product.hasVariants && !selectedVariantId) {
      setMessage("Please select a size option");
      return;
    }

    setIsAdding(true);
    setMessage("");

    try {
      await addToCart({
        productId,
        variantId: selectedVariantId || null,
        quantity: 1,
      });
      setMessage("Added to cart");
    } catch (error) {
      setMessage(
        error.status === 401 ? "Login required" : error.message || "Could not add to cart"
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_45px_rgba(23,63,49,0.08)] transition-transform duration-300 hover:-translate-y-1">
      <Link href={productSlug ? `/product/${productSlug}` : "#"} className="block">
        <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-b from-white to-[#fbf7f1]">
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {(product.badges || []).map((badge) => (
              <span
                key={`${productSlug || product.name}-${badge}`}
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
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
              className="object-contain p-6"
            />
          ) : (
            <span className="text-6xl">{product.emoji}</span>
          )}
          {isOutOfStock ? (
            <span className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
              Out of stock
            </span>
          ) : null}
        </div>

        <div className="p-5">
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
            {product.brand}
          </p>
          <h3 className="mt-2 min-h-14 text-lg font-black leading-7 text-main">
            {product.name}
          </h3>

          {product.variants?.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {product.variants.map((variant) => {
                const isSelected = selectedVariantId === variant._id;

                return (
                  <button
                    key={variant._id}
                    type="button"
                    disabled={variant.isOutOfStock}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setSelectedVariantId(variant._id);
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                      isSelected
                        ? "border-main bg-main text-white"
                        : "border-neutral-200 bg-[#f4faf6] text-main hover:border-main/40"
                    }`}
                  >
                    {variant.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          <p className="mt-2 text-sm font-semibold text-main/65">
            {isOutOfStock ? "Out of stock" : `${displayStock} in stock`}
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-accent">★★★★★</span>
            <span className="font-medium text-main/60">({product.ratingCount})</span>
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-black text-main">
              {formatPrice(displayPrice)}
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
        </div>
      </Link>

      <div className="px-5 pb-5">
        <div className="grid grid-cols-[3.25rem_1fr] gap-3">
          <button
            type="button"
            aria-label={`Add ${product.name} to wishlist`}
            onClick={handleWishlist}
            className={`flex h-12 items-center justify-center rounded-lg border text-xl transition-colors ${
              isWishlistedNow
                ? "border-main bg-main text-white"
                : "border-neutral-200 text-main hover:border-main"
            }`}
          >
            <HiOutlineHeart />
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-main text-base font-black text-white transition-colors hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <HiOutlineShoppingBag />
            {isOutOfStock ? "Out of stock" : isAdding ? "Adding..." : "Add"}
          </button>
        </div>

        {message ? (
          <p className="mt-3 text-xs font-semibold text-main/70">{message}</p>
        ) : null}
      </div>
    </article>
  );
}
