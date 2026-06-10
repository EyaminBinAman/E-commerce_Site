"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const toneClasses = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-800",
  info: "border-main/20 bg-mainSoft text-main",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      title,
      description = "",
      tone = "info",
      duration = 2800,
      actionLabel,
      onAction,
    }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [
        ...prev,
        { id, title, description, tone, actionLabel, onAction },
      ]);

      if (duration > 0) {
        window.setTimeout(() => dismissToast(id), duration);
      }

      return id;
    },
    [dismissToast]
  );

  const confirm = useCallback(
    ({
      title,
      description = "",
      confirmLabel = "Confirm",
      cancelLabel = "Cancel",
      tone = "danger",
      onConfirm,
    }) => {
      setConfirmState({
        title,
        description,
        confirmLabel,
        cancelLabel,
        tone,
        onConfirm,
      });
    },
    []
  );

  const value = useMemo(
    () => ({ showToast, dismissToast, confirm }),
    [showToast, dismissToast, confirm]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-lg ${toneClasses[toast.tone] || toneClasses.info}`}
          >
            <p className="text-sm font-black">{toast.title}</p>
            {toast.description ? (
              <p className="mt-1 text-xs font-semibold opacity-90">
                {toast.description}
              </p>
            ) : null}
            {toast.actionLabel ? (
              <button
                type="button"
                className="mt-2 rounded-lg border border-current/25 px-2.5 py-1 text-xs font-black"
                onClick={() => {
                  toast.onAction?.();
                  dismissToast(toast.id);
                }}
              >
                {toast.actionLabel}
              </button>
            ) : null}
          </div>
        ))}
      </div>
      {confirmState ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-neutral-900/35 backdrop-blur-[1px]"
            onClick={() => setConfirmState(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl">
            <p className="text-lg font-black text-main">{confirmState.title}</p>
            {confirmState.description ? (
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {confirmState.description}
              </p>
            ) : null}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmState(null)}
                className="h-9 rounded-xl border border-neutral-300 bg-white px-3 text-xs font-black text-slate-600 transition hover:bg-neutral-50"
              >
                {confirmState.cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  const fn = confirmState.onConfirm;
                  setConfirmState(null);
                  fn?.();
                }}
                className={`h-9 rounded-xl px-3 text-xs font-black text-white transition ${
                  confirmState.tone === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-main hover:bg-mainHover"
                }`}
              >
                {confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
