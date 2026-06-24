"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import DashboardShell from "@/components/DashboardShell";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import { adminApi } from "@/lib/adminApi";
import { useToast } from "@/components/ui/toast";

const suggestedCategories = ["Dog Food", "Dog Litter", "Dog Treat", "Dog Toys"];

const getApiErrorMessage = (error, fallback) => {
  if (error?.name === "AbortError") {
    return "Backend request timeout. Please verify backend is running on port 3000.";
  }
  return error?.message || fallback;
};

const getAssetOrigin = (apiBaseUrl) => apiBaseUrl.replace(/\/api\/v1\/?$/, "");

const resolveImageUrl = (apiBaseUrl, imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${getAssetOrigin(apiBaseUrl)}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
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
  const [existingImage, setExistingImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const imagePreview = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const animalsData = await adminApi("/animals/get-animals?includeInactive=true", {
          cache: "no-store",
        });
        setAnimals(animalsData.animals || []);

        if (isUpdate) {
          const categoriesData = await adminApi("/categories/get-categories?includeInactive=true", {
            cache: "no-store",
          });

          const found = (categoriesData.categories || []).find((item) => item.slug === editSlug);
          if (!found) {
            throw new Error("Category not found");
          }

          setName(found.name || "");
          setAnimalName(found.animalName || "");
          setExistingImage(found.image || "");
        }
      } catch (error) {
        showToast({
          tone: "danger",
          title: getApiErrorMessage(error, "Failed loading animals."),
        });
      }
    };

    loadFormData();
  }, [apiBaseUrl, editSlug, isUpdate, showToast]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !animalName.trim()) {
      showToast({
        tone: "danger",
        title: "Category name and animal are required.",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("animalName", animalName.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await adminApi(
        isUpdate
          ? `/categories/update-category/${encodeURIComponent(editSlug)}`
          : "/categories/create-category",
        {
          method: isUpdate ? "PATCH" : "POST",
          body: formData,
        }
      );

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
  const shownImage = imagePreview || resolveImageUrl(apiBaseUrl, existingImage);

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
          <form onSubmit={handleSubmit} className="space-y-4">
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
                Category image
              </label>
              <label className="mt-1.5 flex min-h-28 cursor-pointer items-center justify-center rounded-xl border border-dashed border-main/25 bg-mainSoft/30 px-4 text-center text-sm font-semibold text-slate-600 transition hover:border-main/45 hover:bg-mainSoft/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                  className="sr-only"
                />
                {shownImage ? (
                  <span className="flex items-center gap-3">
                    <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                      <Image
                        src={shownImage}
                        alt="Category preview"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="text-left">
                      <span className="block font-black text-main">
                        {imageFile ? imageFile.name : "Current image"}
                      </span>
                      <span className="block text-xs text-slate-500">
                        Click to replace the category image
                      </span>
                    </span>
                  </span>
                ) : (
                  <span>
                    <span className="block font-black text-main">Upload category image</span>
                    <span className="block text-xs text-slate-500">PNG, JPG, WEBP</span>
                  </span>
                )}
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="h-10 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover disabled:cursor-not-allowed disabled:opacity-70"
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
                  onClick={() => setName(item)}
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
              <li>The uploaded image will appear in the storefront.</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
