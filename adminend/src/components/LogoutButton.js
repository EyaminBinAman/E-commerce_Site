"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/components/ui/toast";
import { logoutAdmin } from "@/lib/adminApi";

export default function LogoutButton() {
  const router = useRouter();
  const { showToast } = useToast();
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
      router.replace("/login");
      router.refresh();
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
