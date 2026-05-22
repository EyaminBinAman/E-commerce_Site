"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HiMinus,
  HiOutlineShoppingBag,
  HiPlus,
  HiTrash,
} from "react-icons/hi2";

import { useCart } from "@/components/CartProvider";
import Container from "@/components/Container";

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

export default function CartPage() {
  const {
    cartItems,
    cartSubtotal,
    isLoading,
    updateCartItem,
    removeCartItem,
    clearCart,
  } = useCart();

  return (
    <main className="bg-white">
      <Container className="py-8 lg:py-12">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-black uppercase tracking-wide text-accent">
            Shopping cart
          </p>
          <h1 className="text-3xl font-black text-neutral-950">Your Cart</h1>
        </div>

        {isLoading ? (
          <div className="mt-8 rounded-lg border border-neutral-200 p-8 text-neutral-600">
            Loading cart...
          </div>
        ) : null}

        {!isLoading && cartItems.length === 0 ? (
          <div className="mt-8 rounded-lg border border-neutral-200 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-main/10 text-2xl text-main">
              <HiOutlineShoppingBag />
            </div>
            <h2 className="mt-4 text-xl font-black text-neutral-950">
              Your cart is empty
            </h2>
            <p className="mt-2 text-neutral-600">
              Add products to your cart and they will show up here.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-main px-6 text-sm font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-main/90"
            >
              Continue Shopping
            </Link>
          </div>
        ) : null}

        {cartItems.length > 0 ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item._id}
                  className="grid gap-4 rounded-lg border border-neutral-200 p-4 sm:grid-cols-[120px_1fr] lg:grid-cols-[120px_1fr_auto]"
                >
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="relative aspect-square overflow-hidden rounded-md bg-neutral-50"
                  >
                    <Image
                      src={getImageUrl(item.product.image)}
                      alt={item.product.name}
                      fill
                      sizes="120px"
                      className="object-contain p-3"
                    />
                  </Link>

                  <div>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="text-lg font-black text-neutral-950 transition-colors duration-300 hover:text-main"
                    >
                      {item.product.name}
                    </Link>
                    {item.variant ? (
                      <p className="mt-1 text-sm text-neutral-500">
                        {item.variant.value || item.variant.name || item.variant.sku}
                      </p>
                    ) : null}
                    <p
                      className={`mt-3 text-sm font-bold ${
                        item.isAvailable ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {item.isAvailable ? `${item.stockQuantity} in stock` : "Unavailable"}
                    </p>
                    <p className="mt-3 text-base font-black text-main">
                      {formatPrice(item.finalUnitPrice)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end lg:justify-between">
                    <div className="inline-flex h-11 items-center overflow-hidden rounded-full border border-neutral-200 bg-white">
                      <button
                        type="button"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateCartItem({
                            itemId: item._id,
                            quantity: item.quantity - 1,
                          }).catch(() => undefined)
                        }
                        className="flex h-11 w-11 items-center justify-center text-main transition-colors duration-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300"
                        aria-label="Decrease quantity"
                      >
                        <HiMinus />
                      </button>
                      <span className="flex h-11 min-w-11 items-center justify-center border-x border-neutral-200 px-4 text-sm font-black text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.stockQuantity}
                        onClick={() =>
                          updateCartItem({
                            itemId: item._id,
                            quantity: item.quantity + 1,
                          }).catch(() => undefined)
                        }
                        className="flex h-11 w-11 items-center justify-center text-main transition-colors duration-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-300"
                        aria-label="Increase quantity"
                      >
                        <HiPlus />
                      </button>
                    </div>

                    <div className="text-left lg:text-right">
                      <p className="font-black text-neutral-950">
                        {formatPrice(item.itemSubtotal)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeCartItem(item._id).catch(() => undefined)}
                        className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-red-600 transition-colors duration-300 hover:text-red-700"
                      >
                        <HiTrash />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-lg border border-neutral-200 p-5">
              <h2 className="text-xl font-black text-neutral-950">Summary</h2>
              <div className="mt-5 space-y-3 border-b border-neutral-200 pb-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-black text-neutral-950">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Delivery</span>
                  <span className="font-bold text-neutral-500">Calculated later</span>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-lg">
                <span className="font-black text-neutral-950">Total</span>
                <span className="font-black text-main">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>
              <button
                type="button"
                className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-main px-6 text-sm font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-main/90"
              >
                Proceed to Checkout
              </button>
              <button
                type="button"
                onClick={() => clearCart().catch(() => undefined)}
                className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-neutral-200 px-6 text-sm font-black text-main transition-colors duration-300 hover:border-main hover:bg-main hover:text-white"
              >
                Clear Cart
              </button>
            </aside>
          </div>
        ) : null}
      </Container>
    </main>
  );
}
