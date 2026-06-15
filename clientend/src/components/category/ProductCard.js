"use client";

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

  const productId = product._id || null;
  const productSlug = product.slug || "";
  const isWishlistedNow = productId ? isWishlisted(productId) : false;

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

    setIsAdding(true);
    setMessage("");

    try {
      await addToCart({
        productId,
        variantId: null,
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
            <span className="font-medium text-main/60">({product.ratingCount})</span>
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
            disabled={isAdding}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-main text-base font-black text-white transition-colors hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <HiOutlineShoppingBag />
            {isAdding ? "Adding..." : "Add"}
          </button>
        </div>

        {message ? (
          <p className="mt-3 text-xs font-semibold text-main/70">{message}</p>
        ) : null}
      </div>
    </article>
  );
}
