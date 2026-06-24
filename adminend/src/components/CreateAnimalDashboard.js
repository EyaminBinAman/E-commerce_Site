"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import DashboardShell from "@/components/DashboardShell";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import { adminApi } from "@/lib/adminApi";
import { useToast } from "@/components/ui/toast";

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

export default function CreateAnimalDashboard() {
  const { showToast } = useToast();
  const router = useRouter();
  const apiBaseUrl = getApiBaseUrl();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const animalId = searchParams.get("id");
  const isUpdate = mode === "update" && !!animalId;

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
    const loadAnimalForEdit = async () => {
      if (!isUpdate) return;

      try {
        const data = await adminApi("/animals/get-animals?includeInactive=true", {
          cache: "no-store",
        });

        const found = (data.animals || []).find((item) => item._id === animalId);
        if (!found) {
          throw new Error("Animal not found");
        }

        setName(found.name || "");
        setExistingImage(found.image || "");
      } catch (error) {
        showToast({ tone: "danger", title: getApiErrorMessage(error, "Load failed.") });
      }
    };

    loadAnimalForEdit();
  }, [apiBaseUrl, animalId, isUpdate, showToast]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      showToast({ tone: "danger", title: "Animal name is required." });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await adminApi(
        isUpdate
          ? `/animals/update-animals/${animalId}`
          : "/animals/post-animals",
        {
          method: isUpdate ? "PATCH" : "POST",
          body: formData,
        }
      );

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wide text-main/80">
                Animal name
              </label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Dog"
                className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wide text-main/80">
                Animal image
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
                        alt="Animal preview"
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
                        Click to replace the animal image
                      </span>
                    </span>
                  </span>
                ) : (
                  <span>
                    <span className="block font-black text-main">Upload animal image</span>
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
              Animal Note
            </p>
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-500">
              <li>Animal names should be unique.</li>
              <li>Slug is generated automatically from the name.</li>
              <li>Disabling an animal hides related categories in the app.</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
