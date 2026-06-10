"use client";

import { ToastProvider } from "@/components/ui/toast";

export default function AppProviders({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
