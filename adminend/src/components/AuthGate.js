"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getCurrentAdmin } from "@/lib/adminApi";

const AuthContext = createContext(null);
const publicPaths = ["/login"];

export function AuthGate({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      try {
        const data = await getCurrentAdmin();
        if (!active) return;

        if (data.user?.role !== "admin") {
          setAdmin(null);

          if (!isPublicPath) {
            router.replace("/login");
          }

          return;
        }

        setAdmin(data.user);

        if (isPublicPath) {
          router.replace("/dashboard");
        }
      } catch {
        if (!active) return;
        setAdmin(null);

        if (!isPublicPath) {
          router.replace("/login");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      active = false;
    };
  }, [isPublicPath, router]);

  const value = useMemo(
    () => ({
      admin,
      setAdmin,
    }),
    [admin]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mainSoft/60">
        <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-5 text-sm font-black text-main shadow-lg">
          Checking admin access...
        </div>
      </div>
    );
  }

  if (!admin && !isPublicPath) {
    return null;
  }

  if (admin && isPublicPath) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    return { admin: null, setAdmin: () => {} };
  }

  return context;
}
