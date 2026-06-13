"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import DashboardShell from "@/components/DashboardShell";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import { useToast } from "@/components/ui/toast";

const suggestedCategories = ["Dog Food", "Dog Litter", "Dog Treat", "Dog Toys"];
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

export default function CreateCategoryDashboard() {
  const { showToast } = useToast();
  const router = useRouter();
  const apiBaseUrl = getApiBaseUrl();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const editSlug = searchParams.get("slug");
  const isUpdate = mode === "update" && !!editSlug;
  const [animals, setAnimals] = useState([]);
  const [animalName, setAnimalName] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [animalsResponse, categoriesResponse] = await Promise.all([
          fetchWithTimeout(`${apiBaseUrl}/animals/get-animals?includeInactive=true`, {
            cache: "no-store",
          }),
          isUpdate
            ? fetchWithTimeout(`${apiBaseUrl}/categories/get-categories?includeInactive=true`, {
                cache: "no-store",
              })
            : Promise.resolve(null),
        ]);

        const animalsData = await animalsResponse.json();
        if (!animalsResponse.ok || !animalsData.success) {
          throw new Error(animalsData.message || "Failed to load animals");
        }
        setAnimals(animalsData.animals || []);

        if (isUpdate && categoriesResponse) {
          const categoriesData = await categoriesResponse.json();
          if (!categoriesResponse.ok || !categoriesData.success) {
            throw new Error(categoriesData.message || "Failed to load category details");
          }
          const found = (categoriesData.categories || []).find(
            (item) => item.slug === editSlug
          );
          if (!found) {
            throw new Error("Category not found");
          }
          setName(found.name || "");
          setAnimalName(found.animalName || "");
          setImage(found.image || "");
        }
      } catch (error) {
        showToast({
          tone: "danger",
          title: getApiErrorMessage(error, "Failed loading animals."),
        });
      }
    };
    loadFormData();
  }, [isUpdate, editSlug]);

  const handleCreateCategory = async () => {
    if (!name.trim() || !animalName.trim()) {
      showToast({
        tone: "danger",
        title: "Category name and animal are required.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetchWithTimeout(
        isUpdate
          ? `${apiBaseUrl}/categories/update-category/${encodeURIComponent(editSlug)}`
          : `${apiBaseUrl}/categories/create-category`,
        {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            animalName: animalName.trim(),
            image: image.trim() || null,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(
          data.message || `Failed to ${isUpdate ? "update" : "create"} category`
        );
      }
      showToast({
        tone: "success",
        title: `Category ${isUpdate ? "updated" : "created"} successfully.`,
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

  const title = isUpdate ? "Update Category" : "Create Category";

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
          Categories
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          {isUpdate
            ? "Update category details and animal mapping used across storefront."
            : "Add a category under a selected animal. Categories can be turned on or off and used throughout the admin app."}
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wide text-main/80">
                Animal
              </label>
              <select
                value={animalName}
                onChange={(event) => setAnimalName(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-main"
              >
                <option value="">Select an animal</option>
                {animals.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wide text-main/80">
                Category name
              </label>
              <input
                type="text"
                placeholder="Premium Dog Food"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wide text-main/80">
                Category icon
              </label>
              <div className="mt-1.5 flex items-center gap-3">
                <button
                  type="button"
                  className="h-9 rounded-xl bg-main px-3 text-xs font-black text-white transition hover:bg-mainHover"
                >
                  Choose file
                </button>
                <span className="text-sm font-semibold text-slate-400">
                  {image ? "Image URL ready" : "No file chosen"}
                </span>
              </div>
              <input
                type="url"
                placeholder="Optional image URL"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                className="mt-2 h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
              />
            </div>

            <label className="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-slate-600">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#173F31]" />
              Category is active
            </label>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-main/60">
              Suggested Categories
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-full border border-main/20 bg-mainSoft/60 px-3 py-1.5 text-xs font-black text-main transition hover:bg-mainSoft"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-main/60">
              Category Note
            </p>
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-500">
              <li>Each category belongs to one animal only.</li>
              <li>The slug updates automatically from the name when saved.</li>
              <li>Uploading a new icon will replace the current preview.</li>
            </ul>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-lg shadow-main/5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={handleCreateCategory}
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
