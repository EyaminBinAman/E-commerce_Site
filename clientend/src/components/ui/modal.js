"use client";

import { useEffect } from "react";
import { HiOutlineXMark } from "react-icons/hi2";

import { cn } from "@/lib/utils";

export default function Modal({
  open,
  onClose,
  children,
  className,
  hideClose = false,
}) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center px-4 py-4 transition-opacity duration-300",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-neutral-900/55 backdrop-blur-sm" />

      <div
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "relative z-10 overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_rgba(15,23,42,0.25)] transition-all duration-300",
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0",
          className
        )}
      >
        {!hideClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors duration-300 hover:bg-neutral-100 hover:text-neutral-800"
          >
            <HiOutlineXMark className="text-xl" />
          </button>
        ) : null}
        {children}
      </div>
    </div>
  );
}
