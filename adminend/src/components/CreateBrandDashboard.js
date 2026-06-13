"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import DashboardShell from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import { adminApi } from "@/lib/adminApi";

const emptyForm = {
  name: "",
  animalNames: "",
  image: "",
};

export default function CreateBrandDashboard({ mode = "create" }) {
  const isUpdate = mode === "update";
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(isUpdate && !!slug);

  useEffect(() => {
    if (!isUpdate || !slug) {
      return;
    }

    adminApi("/brands/get-brands")
      .then((data) => {
        const match = (data.brands || []).find((item) => item.slug === slug);
        if (!match) {
          throw new Error("Brand not found");
        }

        setForm({
          name: match.name || "",
          animalNames: (match.animalNames || []).join(", "),
          image: match.image || "",
        });
        setActive(match.isActive !== false);
      })
      .catch((error) => {
        showToast({
          tone: "danger",
          title: error.message || "Failed to load brand.",
        });
      })
      .finally(() => setLoading(false));
  }, [isUpdate, slug, showToast]);

  const title = useMemo(() => (isUpdate ? "Update Brand" : "Create Brand"), [isUpdate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      showToast({ tone: "warning", title: "Brand name is required." });
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: form.name.trim(),
      animalNames: form.animalNames,
      image: form.image.trim(),
    };

    const request = isUpdate && slug
      ? adminApi(`/brands/update-brand/${slug}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : adminApi("/brands/create-brand", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    request
      .then(() => {
        showToast({
          tone: "success",
          title: isUpdate ? "Brand updated successfully." : "Brand created successfully.",
        });
      })
      .catch((error) => {
        showToast({
          tone: "danger",
          title: error.message || "Failed to save brand.",
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const toggleActive = () => {
    if (!slug) {
      return;
    }

    adminApi(`/brands/active-on-off-brand/${slug}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !active }),
    })
      .then((data) => {
        setActive(data.brand?.isActive ?? !active);
        showToast({ tone: "success", title: "Brand visibility updated." });
      })
      .catch((error) => {
        showToast({
          tone: "danger",
          title: error.message || "Failed to update visibility.",
        });
      });
  };

  return (
    <DashboardShell activeItem="Brands">
      <div className="mb-4">
        <Link
          href="/dashboard/brands"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-main/20 bg-mainSoft px-3 text-sm font-black text-main transition hover:bg-mainSoft/70"
        >
          <span aria-hidden="true">&larr;</span>
          Back to brands
        </Link>
      </div>

      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
          Brands
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
          {title}
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          {loading ? "Loading brand..." : "Connected to the backend brand routes."}
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Brand name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Whiskas"
            />
            <Field
              label="Animal names"
              name="animalNames"
              value={form.animalNames}
              onChange={handleChange}
              placeholder="Cat, Dog"
            />
            <Field
              label="Image URL"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="/uploads/brands/whiskas.png"
            />

            <div className="flex items-center gap-3 pt-1">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={toggleActive}
                  disabled={!isUpdate || !slug}
                  className="h-4 w-4 accent-[#173F31] disabled:cursor-not-allowed"
                />
                Brand is active
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="h-10 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : isUpdate ? "Update Brand" : "Create Brand"}
              </button>
              <Link
                href="/dashboard/brands"
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
              Brand Note
            </p>
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-500">
              <li>Animal names can be comma-separated.</li>
              <li>The image field accepts a stored path or URL.</li>
              <li>Active state updates through the backend toggle route.</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Field({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wide text-main/80">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
      />
    </div>
  );
}
