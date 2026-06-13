"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import DashboardShell from "@/components/DashboardShell";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import { useToast } from "@/components/ui/toast";

const REQUEST_TIMEOUT_MS = 12000;

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const getApiErrorMessage = (error, fallback) => {
  if (error?.name === "AbortError") {
    return "Backend request timeout. Please verify backend is running on port 3000.";
  }
  return error?.message || fallback;
};

export default function CreateAnimalDashboard() {
  const { showToast } = useToast();
  const router = useRouter();
  const apiBaseUrl = getApiBaseUrl();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const animalId = searchParams.get("id");
  const isUpdate = mode === "update" && !!animalId;
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAnimalForEdit = async () => {
    if (!isUpdate) return;
    try {
      const response = await fetchWithTimeout(
        `${apiBaseUrl}/animals/get-animals?includeInactive=true`,
        {
          cache: "no-store",
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load animal details");
      }
      const found = (data.animals || []).find((item) => item._id === animalId);
      if (!found) {
        throw new Error("Animal not found");
      }
      setName(found.name || "");
    } catch (error) {
      showToast({ tone: "danger", title: getApiErrorMessage(error, "Load failed.") });
    }
  };

  useEffect(() => {
    loadAnimalForEdit();
  }, [isUpdate, animalId]);

  const handleCreate = async () => {
    if (!name.trim()) {
      showToast({ tone: "danger", title: "Animal name is required." });
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithTimeout(
        isUpdate
          ? `${apiBaseUrl}/animals/update-animals/${animalId}`
          : `${apiBaseUrl}/animals/post-animals`,
        {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || `Failed to ${isUpdate ? "update" : "create"} animal`);
      }
      showToast({
        tone: "success",
        title: `Animal ${isUpdate ? "updated" : "created"} successfully.`,
      });
      router.push("/dashboard/categories");
    } catch (error) {
      showToast({
        tone: "danger",
        title: getApiErrorMessage(error, `${isUpdate ? "Update" : "Create"} failed.`),
      });
    } finally {
      setLoading(false);
    }
  };

  const title = isUpdate ? "Update Animal" : "Create Animal";

  return (
    <DashboardShell activeItem="Categories">
      <div className="mb-4">
        <Link
          href="/dashboard/categories"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-main/20 bg-mainSoft px-3 text-sm font-black text-main transition hover:bg-mainSoft/70"
        >
          <span aria-hidden="true">&larr;</span>
          Back to categories
        </Link>
      </div>

      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
          Animals
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          {isUpdate
            ? "Update animal details used by category and product mapping."
            : "Add a new animal type for catalog organization. You can then attach categories and products to this animal."}
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wide text-main/80">
                Animal name
              </label>
              <input
                type="text"
                placeholder="Dog"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wide text-main/80">
                Animal icon
              </label>
              <div className="mt-1.5 flex items-center gap-3">
                <button
                  type="button"
                  className="h-9 rounded-xl bg-main px-3 text-xs font-black text-white transition hover:bg-mainHover"
                >
                  Choose file
                </button>
                <span className="text-sm font-semibold text-slate-400">
                  No file chosen
                </span>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-slate-600">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#173F31]" />
              Animal is active
            </label>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-main/60">
              Animal Note
            </p>
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-500">
              <li>Animal names should be unique.</li>
              <li>Slug should be lowercase and URL-friendly.</li>
              <li>Disabling an animal can hide related categories in the app.</li>
            </ul>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-lg shadow-main/5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={handleCreate}
                className="h-10 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover"
              >
                {loading ? (isUpdate ? "Updating..." : "Creating...") : title}
              </button>
              <Link
                href="/dashboard/categories"
                className="text-sm font-black text-slate-500 transition hover:text-main"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
