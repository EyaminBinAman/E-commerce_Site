"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  HiMinus,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiPlus,
  HiStar,
} from "react-icons/hi2";

import { useCart } from "@/components/CartProvider";
import { useWishlist } from "@/components/WishlistProvider";

const apiOrigin =
  process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:3000";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const getImageUrl = (src) => {
  if (!src) {
    return "/window.svg";
  }

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  return `${apiOrigin}${src.startsWith("/") ? src : `/${src}`}`;
};

const getFinalPrice = (product, selectedVariant) => {
  const basePrice =
    typeof product.discountPrice === "number" ? product.discountPrice : product.price;
  return Number(basePrice || 0) + Number(selectedVariant?.priceAdjustment || 0);
};

function QuantityControl({ quantity, setQuantity, disabled }) {
  return (
    <div className="inline-flex h-12 items-center overflow-hidden rounded-full border border-neutral-200 bg-white">
      <button
        type="button"
        disabled={disabled || quantity <= 1}
        onClick={() => setQuantity((current) => Math.max(1, current - 1))}
        className="flex h-12 w-12 items-center justify-center text-main transition-colors duration-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300"
        aria-label="Decrease quantity"
      >
        <HiMinus />
      </button>
      <span className="flex h-12 min-w-12 items-center justify-center border-x border-neutral-200 px-4 text-base font-bold text-neutral-900">
        {quantity}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setQuantity((current) => current + 1)}
        className="flex h-12 w-12 items-center justify-center text-main transition-colors duration-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300"
        aria-label="Increase quantity"
      >
        <HiPlus />
      </button>
    </div>
  );
}

function RelatedProductCard({ product }) {
  const imageUrl = getImageUrl(product.images?.[0]);
  const hasDiscount = typeof product.discountPrice === "number";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-lg border border-neutral-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:border-main/30 hover:shadow-[0_16px_40px_rgba(23,63,49,0.10)]"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-neutral-50">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h3 className="mt-4 line-clamp-2 min-h-12 text-sm font-bold leading-6 text-neutral-900">
        {product.name}
      </h3>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="font-black text-main">
          {formatPrice(hasDiscount ? product.discountPrice : product.price)}
        </span>
        {hasDiscount ? (
          <span className="text-sm text-neutral-400 line-through">
            {formatPrice(product.price)}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

export default function ProductDetails({ product, relatedProducts }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const images = product.images?.length ? product.images : [null];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const activeVariants = useMemo(
    () => (product.variants || []).filter((variant) => variant.isActive),
    [product.variants]
  );
  const [selectedVariantId, setSelectedVariantId] = useState(
    activeVariants[0]?._id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [cartMessage, setCartMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const selectedVariant = activeVariants.find(
    (variant) => variant._id === selectedVariantId
  );
  const finalPrice = getFinalPrice(product, selectedVariant);
  const stockQuantity =
    selectedVariant?.stockQuantity ?? product.stockQuantity ?? 0;
  const isOutOfStock = product.isOutOfStock || stockQuantity <= 0;
  const hasDiscount = typeof product.discountPrice === "number";
  const productIsWishlisted = isWishlisted(product._id);

  const tabs = [
    { id: "description", label: "Description" },
    { id: "information", label: "Additional information" },
    { id: "reviews", label: "Reviews" },
  ];

  const handleAddToCart = async () => {
    setCartMessage("");
    setIsAddingToCart(true);

    try {
      await addToCart({
        productId: product._id,
        variantId: selectedVariant?._id || null,
        quantity,
        product,
      });
      setCartMessage("Added to cart");
    } catch (error) {
      setCartMessage(error.message || "Could not add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    setWishlistMessage("");

    try {
      const added = await toggleWishlist(product);
      setWishlistMessage(added ? "Added to wishlist" : "Removed from wishlist");
    } catch (error) {
      setWishlistMessage(error.message || "Could not update wishlist");
    }
  };

  return (
    <>
      <nav className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
        <Link href="/" className="transition-colors duration-300 hover:text-main">
          Home
        </Link>
        <span>/</span>
        {product.category?.slug ? (
          <Link
            href={`/category/${product.category.slug}`}
            className="transition-colors duration-300 hover:text-main"
          >
            {product.category.name}
          </Link>
        ) : (
          <span>{product.category?.name || "Products"}</span>
        )}
        <span>/</span>
        <span className="font-semibold text-neutral-800">{product.name}</span>
      </nav>

      <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
            {hasDiscount && product.discountPercentage > 0 ? (
              <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-sm font-black text-white">
                -{Math.round(product.discountPercentage)}%
              </span>
            ) : null}
            <Image
              src={getImageUrl(selectedImage)}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8"
            />
          </div>

          {images.length > 1 ? (
            <div className="mt-4 grid grid-cols-5 gap-3 sm:grid-cols-6">
              {images.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`relative aspect-square overflow-hidden rounded-md border bg-neutral-50 transition-all duration-300 ${
                    selectedImage === image
                      ? "border-main ring-2 ring-main/15"
                      : "border-neutral-200 hover:border-main/40"
                  }`}
                  aria-label={`View ${product.name} image`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={product.name}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.brand?.name ? (
              <span className="rounded-full bg-main/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-main">
                {product.brand.name}
              </span>
            ) : null}
            {product.isFeatured ? (
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
                Featured
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-3xl font-black leading-tight text-neutral-950 sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-1 text-accent">
            {[1, 2, 3, 4, 5].map((item) => (
              <HiStar key={item} />
            ))}
            <span className="ml-2 text-sm font-semibold text-neutral-500">
              No reviews yet
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-black text-main">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount ? (
              <span className="pb-1 text-xl font-semibold text-neutral-400 line-through">
                {formatPrice(product.price)}
              </span>
            ) : null}
          </div>

          <p className="mt-5 line-clamp-4 text-base leading-8 text-neutral-600">
            {product.description}
          </p>

          <div className="mt-6 space-y-4 border-y border-neutral-200 py-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-bold text-neutral-900">Availability:</span>
              <span
                className={`rounded-full px-3 py-1 font-bold ${
                  isOutOfStock
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {isOutOfStock ? "Out of stock" : `${stockQuantity} in stock`}
              </span>
            </div>

            {activeVariants.length ? (
              <div>
                <p className="text-sm font-bold text-neutral-900">Options</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeVariants.map((variant) => (
                    <button
                      key={variant._id}
                      type="button"
                      onClick={() => setSelectedVariantId(variant._id)}
                      className={`rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 ${
                        selectedVariantId === variant._id
                          ? "border-main bg-main text-white"
                          : "border-neutral-200 text-neutral-700 hover:border-main hover:text-main"
                      }`}
                    >
                      {variant.value || variant.name || variant.sku}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              <QuantityControl
                quantity={quantity}
                setQuantity={setQuantity}
                disabled={isOutOfStock}
              />
              <button
                type="button"
                disabled={isOutOfStock || isAddingToCart}
                onClick={handleAddToCart}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-main px-6 text-sm font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-main/90 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                <HiOutlineShoppingBag className="text-lg" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={handleToggleWishlist}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 px-5 text-sm font-black text-main transition-all duration-300 hover:border-main hover:bg-main hover:text-white"
              >
                <HiOutlineHeart className="text-lg" />
                {productIsWishlisted ? "Wishlisted" : "Wishlist"}
              </button>
            </div>
            {cartMessage ? (
              <p
                className={`text-sm font-bold ${
                  cartMessage === "Added to cart" ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {cartMessage}
              </p>
            ) : null}
            {wishlistMessage ? (
              <p
                className={`text-sm font-bold ${
                  wishlistMessage.includes("Added") ||
                  wishlistMessage.includes("Removed")
                    ? "text-emerald-700"
                    : "text-red-600"
                }`}
              >
                {wishlistMessage}
              </p>
            ) : null}
          </div>

          <dl className="mt-6 grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
            <div>
              <dt className="font-bold text-neutral-900">Category</dt>
              <dd>{product.category?.name || "Uncategorized"}</dd>
            </div>
            <div>
              <dt className="font-bold text-neutral-900">Brand</dt>
              <dd>{product.brand?.name || "No brand"}</dd>
            </div>
            {selectedVariant?.sku ? (
              <div>
                <dt className="font-bold text-neutral-900">SKU</dt>
                <dd>{selectedVariant.sku}</dd>
              </div>
            ) : null}
            {product.tags?.length ? (
              <div>
                <dt className="font-bold text-neutral-900">Tags</dt>
                <dd>{product.tags.join(", ")}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      <section className="mt-14 border-t border-neutral-200 pt-8">
        <div className="flex flex-wrap gap-2 border-b border-neutral-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-4 py-3 text-sm font-black transition-colors duration-300 ${
                activeTab === tab.id
                  ? "border-main text-main"
                  : "border-transparent text-neutral-500 hover:text-main"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-7">
          {activeTab === "description" ? (
            <p className="max-w-4xl whitespace-pre-line text-base leading-8 text-neutral-700">
              {product.description}
            </p>
          ) : null}

          {activeTab === "information" ? (
            <div className="grid max-w-3xl gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-neutral-200 p-4">
                <p className="font-bold text-neutral-900">Stock</p>
                <p className="mt-1 text-neutral-600">{stockQuantity}</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <p className="font-bold text-neutral-900">Offer</p>
                <p className="mt-1 text-neutral-600">
                  {hasDiscount ? `${product.discountPercentage}% discount` : "No active offer"}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <p className="font-bold text-neutral-900">Category</p>
                <p className="mt-1 text-neutral-600">
                  {product.category?.name || "Uncategorized"}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <p className="font-bold text-neutral-900">Brand</p>
                <p className="mt-1 text-neutral-600">
                  {product.brand?.name || "No brand"}
                </p>
              </div>
            </div>
          ) : null}

          {activeTab === "reviews" ? (
            <div className="max-w-2xl rounded-lg border border-neutral-200 p-5">
              <h2 className="text-xl font-black text-neutral-950">Reviews</h2>
              <p className="mt-3 text-neutral-600">
                There are no reviews yet.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="mt-10 border-t border-neutral-200 pt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-accent">
                More to explore
              </p>
              <h2 className="mt-2 text-2xl font-black text-neutral-950">
                Related products
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <RelatedProductCard key={item._id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
