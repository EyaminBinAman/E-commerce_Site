"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineHeart,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingCart,
  HiOutlineUser,
} from "react-icons/hi2";
import { PiPawPrintFill } from "react-icons/pi";

import { useCart } from "@/components/CartProvider";
import Container from "@/components/Container";
import ForgotPasswordPopover from "@/components/ForgotPasswordPopover";
import LoginPopover from "@/components/LoginPopover";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { getInitials } from "@/lib/profileMock";

const secondaryActions = [
  { id: "wishlist", label: "Wishlist", count: null, icon: HiOutlineHeart, href: "/profile?tab=wishlist" },
  { id: "cart", label: "Cart", count: 0, icon: HiOutlineShoppingCart, href: "/cart" },
];

const getImageUrl = (src) => {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return `${API_BASE_URL.replace("/api/v1", "")}${src}`;
};

export default function MiddleBar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [notice, setNotice] = useState("");

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const handleForgotPassword = (email) => {
    setForgotEmail(email || "");
    setIsForgotOpen(true);
  };

  const handleHomeClick = (event) => {
    if (pathname !== "/") return;

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  return (
    <>
      {notice ? (
        <div className="fixed right-5 top-5 z-[60] rounded-2xl border border-mainSoft bg-white px-5 py-3 text-sm font-semibold text-main shadow-[0_16px_40px_rgba(20,83,45,0.18)]">
          {notice}
        </div>
      ) : null}

      <div className="border-b border-neutral-200 bg-white">
        <Container>
          <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <Link
              href="/"
              onClick={handleHomeClick}
              className="flex items-center gap-3 text-main"
            >
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
                {user ? (
                  <div className="flex h-12 overflow-hidden rounded-2xl border border-neutral-200 text-main transition-colors duration-300 hover:border-main">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 text-sm font-semibold transition-colors duration-300 hover:bg-main hover:text-white"
                    >
                      {user.profilePic ? (
                        <img
                          src={getImageUrl(user.profilePic)}
                          alt={user.fullName}
                          className="h-7 w-7 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-accent text-xs font-extrabold text-main">
                          {getInitials(user.fullName)}
                        </span>
                      )}
                      <span>Profile</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      aria-label="Logout"
                      title="Logout"
                      className="flex w-12 items-center justify-center border-l border-neutral-200 transition-colors duration-300 hover:bg-red-500 hover:text-white"
                    >
                      <HiOutlineArrowRightOnRectangle className="text-lg" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsLoginOpen(true)}
                    className="flex h-12 items-center gap-2 rounded-2xl border border-neutral-200 px-4 text-sm font-semibold text-main transition-colors duration-300 hover:border-main hover:bg-main hover:text-white"
                  >
                    <HiOutlineUser className="text-lg" />
                    <span>Sign In</span>
                  </button>
                )}

                {secondaryActions.map(({ id, label, count, icon: Icon, href }) => (
                  <Link
                    key={id}
                    href={href}
                    className="flex h-12 items-center gap-2 rounded-2xl border border-neutral-200 px-4 text-sm font-semibold text-main transition-colors duration-300 hover:border-main hover:bg-main hover:text-white"
                  >
                    <Icon className="text-lg" />
                    <span>{label}</span>
                    {typeof count === "number" ? (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-main px-1 text-xs text-white">
                        {id === "cart" ? cartCount : count}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>

      <LoginPopover
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onForgotPassword={handleForgotPassword}
        onSuccess={showNotice}
      />

      <ForgotPasswordPopover
        open={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        defaultEmail={forgotEmail}
      />
    </>
  );
}
