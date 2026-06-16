"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import Container from "@/components/Container";
import { getAssetOrigin } from "@/lib/bannerApi";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Contact", href: "/" },
];

function NavDropdown({ label, open, onToggle, onClose, children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="relative inline-flex items-center gap-1 transition-opacity duration-300 hover:opacity-80"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <span className="text-xs">▾</span>
      </button>

      {open ? (
        <div className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2">
          <div className="max-h-80 overflow-y-auto rounded-lg border border-white/10 bg-white p-2 text-left text-main shadow-[0_18px_55px_rgba(23,63,49,0.2)]">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Navbar({
  animals = [],
  brands = [],
}) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const pathname = usePathname();

  const closeMenus = useCallback(() => {
    setIsCategoriesOpen(false);
    setIsBrandsOpen(false);
  }, []);

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
            {navLinks.map((item) => {
              if (item.label === "Categories") {
                return (
                  <NavDropdown
                    key={item.label}
                    label={item.label}
                    open={isCategoriesOpen}
                    onClose={closeMenus}
                    onToggle={() => {
                      setIsBrandsOpen(false);
                      setIsCategoriesOpen((isOpen) => !isOpen);
                    }}
                  >
                    {animals.map((animal) => (
                      <Link
                        key={animal.slug}
                        href={`/categories/${animal.slug}`}
                        onClick={closeMenus}
                        className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-black transition-colors hover:bg-[#eef8f2]"
                      >
                        <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-mainSoft">
                          {animal.image ? (
                            <Image
                              src={
                                animal.image.startsWith("http")
                                  ? animal.image
                                  : `${getAssetOrigin()}${animal.image.startsWith("/") ? animal.image : `/${animal.image}`}`
                              }
                              alt={animal.name}
                              width={28}
                              height={28}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">{animal.icon}</span>
                          )}
                        </span>
                        {animal.name}
                      </Link>
                    ))}
                  </NavDropdown>
                );
              }

              if (item.label === "Brands") {
                return (
                  <NavDropdown
                    key={item.label}
                    label={item.label}
                    open={isBrandsOpen}
                    onClose={closeMenus}
                    onToggle={() => {
                      setIsCategoriesOpen(false);
                      setIsBrandsOpen((isOpen) => !isOpen);
                    }}
                  >
                    {brands.map((brand) => (
                      <Link
                        key={brand.slug}
                        href={`/brands/${brand.slug}`}
                        onClick={closeMenus}
                        className="block rounded-md px-3 py-3 text-sm font-black transition-colors hover:bg-[#eef8f2]"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </NavDropdown>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={item.label === "Home" ? handleHomeClick : undefined}
                  className="relative transition-opacity duration-300 hover:opacity-80"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </Container>
    </div>
  );
}
