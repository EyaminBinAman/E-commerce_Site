"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

export function OtpInput({ value, onChange, length = 6, error = false }) {
  const refs = useRef([]);

  const handleChange = (index, raw) => {
    const ch = raw.slice(-1);
    if (ch && !/^\d$/.test(ch)) return;

    const next = [...value];
    next[index] = ch;
    onChange(next);

    if (ch && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      event.preventDefault();
      const next = [...value];
      next[index - 1] = "";
      onChange(next);
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;

    event.preventDefault();
    const next = Array.from({ length }, (_, i) => pasted[i] || "");
    onChange(next);

    const focusIndex = Math.min(pasted.length, length - 1);
    refs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={value[index] || ""}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          className={cn(
            "h-12 w-11 rounded-xl border bg-white text-center text-xl font-bold text-neutral-800 outline-none transition-colors duration-300",
            error
              ? "border-red-400 focus:border-red-500"
              : "border-neutral-200 focus:border-main"
          )}
        />
      ))}
    </div>
  );
}
