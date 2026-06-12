"use client";

import { ToastProvider } from "@/components/ui/toast";
import { AuthGate } from "@/components/AuthGate";

export default function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthGate>{children}</AuthGate>
    </ToastProvider>
  );
}
