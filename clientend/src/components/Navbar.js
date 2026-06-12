"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import Container from "@/components/Container";
import { animals } from "@/data/categoryPageData";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories/dogs" },
  { label: "Brands", href: "/" },
  { label: "Contact", href: "/" },
];

export default function Navbar() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const pathname = usePathname();

  const handleHomeClick = (event) => {
    if (pathname !== "/") return;

    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-main text-white">
      <Container className="text-center">
        <div className="flex min-h-13 items-center justify-center py-3 lg:py-0">
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base font-semibold">
            {navLinks.map((item) => (
              item.label === "Categories" ? (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoriesOpen((isOpen) => !isOpen)}
                    onBlur={(event) => {
                      if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) {
                        setIsCategoriesOpen(false);
                      }
                    }}
                    className="relative inline-flex items-center gap-1 transition-opacity duration-300 hover:opacity-80"
                    aria-expanded={isCategoriesOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <span className="text-xs">▾</span>
                  </button>

                  <div
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                    className={`absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 rounded-lg border border-white/10 bg-white p-2 text-left text-main shadow-[0_18px_55px_rgba(23,63,49,0.2)] transition-all duration-200 ${
                      isCategoriesOpen
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                    }`}
                  >
                    {animals.map((animal) => (
                      <Link
                        key={animal.slug}
                        href={`/categories/${animal.slug}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-black transition-colors hover:bg-[#eef8f2]"
                      >
                        <span className="text-lg">{animal.icon}</span>
                        {animal.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={item.label === "Home" ? handleHomeClick : undefined}
                  className="relative transition-opacity duration-300 hover:opacity-80"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>
        </div>
      </Container>
    </div>
  );
}
