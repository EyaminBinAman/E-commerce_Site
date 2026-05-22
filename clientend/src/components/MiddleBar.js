 "use client";

import Link from "next/link";
import {
  HiOutlineHeart,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingCart,
  HiOutlineUser,
} from "react-icons/hi2";
import { PiPawPrintFill } from "react-icons/pi";

import { useCart } from "@/components/CartProvider";
import Container from "@/components/Container";

export default function MiddleBar() {
  const { cartCount } = useCart();
  const quickActions = [
    { label: "Sign In", count: null, icon: HiOutlineUser, href: "/" },
    { label: "Wishlist", count: null, icon: HiOutlineHeart, href: "/" },
    { label: "Cart", count: cartCount, icon: HiOutlineShoppingCart, href: "/cart" },
  ];

  return (
    <div className="border-b border-neutral-200 bg-white">
      <Container>
        <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3 text-main">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accentSoft text-xl">
              <PiPawPrintFill className="text-main" />
            </span>
            <div className="leading-none">
              <span className="text-[2rem] font-black tracking-[-0.04em] text-main">
                Paw
              </span>
              <span className="text-[2rem] font-black tracking-[-0.04em] text-accent">
                Tail
              </span>
            </div>
          </Link>

          <div className="flex flex-1 flex-col gap-4 lg:mx-8 lg:max-w-4xl lg:flex-row lg:items-center">
            <form className="group flex flex-1 items-center rounded-full border border-neutral-200 bg-white pl-5 shadow-[0_8px_30px_rgba(23,63,49,0.08)] transition-all duration-300 focus-within:border-main">
              <input
                type="text"
                placeholder="Search food, toys, litter, fish care, flea treatment..."
                className="h-14 flex-1 bg-transparent text-[15px] text-neutral-700 outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-transform duration-300 group-hover:scale-105"
              >
                <HiOutlineMagnifyingGlass className="text-lg" />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-3">
              {quickActions.map(({ label, count, icon: Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex h-12 items-center gap-2 rounded-2xl border border-neutral-200 px-4 text-sm font-semibold text-main transition-colors duration-300 hover:border-main hover:bg-main hover:text-white"
                >
                  <Icon className="text-lg" />
                  <span>{label}</span>
                  {typeof count === "number" ? (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-main px-1 text-xs text-white">
                      {count}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
