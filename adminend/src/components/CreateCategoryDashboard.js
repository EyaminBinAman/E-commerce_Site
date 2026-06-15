"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import DashboardShell from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import { adminApi } from "@/lib/adminApi";

const suggestedCategories = [
  "Dog Food",
  "Dog Litter",
  "Dog Treat",
  "Dog Toys",
];

const initialForm = {
  animalName: "",
  name: "",
  image: "",
  isActive: true,
};

export default function CreateCategoryDashboard() {
  const { showToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [animals, setAnimals] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi("/animals/get-animals")
      .then((data) => setAnimals(data.animals || []))
      .catch((error) => {
        showToast({
          tone: "danger",
          title: error.message || "Failed to load animals.",
        });
      });
  }, [showToast]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.animalName || !form.name.trim()) {
      showToast({ tone: "warning", title: "Animal and category name are required." });
      return;
    }

    setSaving(true);
    try {
      await adminApi("/categories/create-category", {
        method: "POST",
        body: JSON.stringify({
          animalName: form.animalName,
          name: form.name.trim(),
          image: form.image.trim() || null,
          isActive: form.isActive,
        }),
      });

      setForm(initialForm);
      showToast({ tone: "success", title: "Category created successfully." });
    } catch (error) {
      showToast({ tone: "danger", title: error.message || "Failed to create category." });
    } finally {
      setSaving(false);
    }
  };

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
          Create Category
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          Add a category under a selected animal. Categories can be turned on or
          off and used throughout the admin app.
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
                name="animalName"
                value={form.animalName}
                onChange={handleChange}
                className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-main"
              >
                <option value="">Select an animal</option>
                {animals.map((animal) => (
                  <option key={animal._id} value={animal.name}>
                    {animal.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wide text-main/80">
                Category name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                placeholder="Premium Dog Food"
                className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wide text-main/80">
                Category icon
              </label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                type="text"
                placeholder="DF"
                className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
              />
            </div>

            <label className="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-slate-600">
              <input
                name="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4 accent-[#173F31]"
              />
              Category is active
            </label>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="h-10 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : "Create Category"}
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
                  onClick={() => setForm((prev) => ({ ...prev, name: item }))}
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
              <li>Use a short icon label or code for the preview tile.</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
