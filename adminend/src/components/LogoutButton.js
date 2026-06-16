"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/components/ui/toast";
import { useAdminAuth } from "@/components/AuthGate";
import { logoutAdmin } from "@/lib/adminApi";
import { clearAdminSession } from "@/lib/adminSession";

export default function LogoutButton({ variant = "default" }) {
  const router = useRouter();
  const { showToast } = useToast();
  const { setAdmin } = useAdminAuth();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await logoutAdmin();
      showToast({
        title: "Logged out",
        description: "Admin session ended.",
        tone: "success",
      });
      clearAdminSession();
      setAdmin(null);
      router.replace("/login");
    } catch (error) {
      showToast({
        title: "Logout failed",
        description: error.message,
        tone: "danger",
      });
    } finally {
      setLoading(false);
    }
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        aria-label="Logout"
        title="Logout"
        className="flex w-12 items-center justify-center border-l border-neutral-200 transition-colors duration-300 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <span className="text-xs font-bold">...</span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M21 3v18" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex h-12 items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 text-sm font-black text-main shadow-sm transition hover:bg-mainSoft disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
