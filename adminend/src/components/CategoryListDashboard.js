"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DashboardShell, { Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import { adminApi } from "@/lib/adminApi";

function StatusToggle({ on = true, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wide ${
        on ? "text-main" : "text-red-600"
      }`}
    >
      <span className="relative inline-flex h-7 w-14 items-center">
        <span
          className={`absolute inset-0 rounded-full border transition-colors ${
            on ? "border-main/25 bg-mainSoft" : "border-red-200 bg-red-100"
          }`}
        />
        <span
          className={`absolute inline-flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm transition-transform ${
            on ? "translate-x-8 bg-main" : "translate-x-1 bg-red-500"
          }`}
        >
          <Icon name={on ? "check" : "x"} className="h-2.5 w-2.5" />
        </span>
      </span>
      <span>{on ? "On" : "Off"}</span>
    </button>
  );
}

export default function CategoryListDashboard() {
  const { showToast, confirm } = useToast();
  const [animalRows, setAnimalRows] = useState([]);
  const [categoryRows, setCategoryRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    Promise.all([
      adminApi("/animals/get-animals?includeInactive=true"),
      adminApi("/categories/get-categories"),
    ])
      .then(([animalData, categoryData]) => {
        if (!alive) return;
        setAnimalRows(animalData.animals || []);
        setCategoryRows(categoryData.categories || []);
      })
      .catch((error) => {
        showToast({
          tone: "danger",
          title: error.message || "Failed to load categories.",
        });
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [showToast]);

  const filteredAnimals = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return animalRows;
    return animalRows.filter((item) =>
      [item.name, item.slug].some((value) => value?.toLowerCase().includes(query))
    );
  }, [animalRows, search]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categoryRows;
    return categoryRows.filter((item) =>
      [item.name, item.slug, item.animalName]
        .some((value) => value?.toLowerCase().includes(query))
    );
  }, [categoryRows, search]);

  const toggleAnimalStatus = async (animal) => {
    try {
      await adminApi(`/animals/active-on-off-animals/${animal._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !animal.isActive }),
      });
      const data = await adminApi("/animals/get-animals?includeInactive=true");
      setAnimalRows(data.animals || []);
    } catch (error) {
      showToast({ tone: "danger", title: error.message || "Failed to update animal." });
    }
  };

  const toggleCategoryStatus = async (category) => {
    try {
      await adminApi(`/categories/active-on-off-animals/${category.slug}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !category.isActive }),
      });
      const data = await adminApi("/categories/get-categories");
      setCategoryRows(data.categories || []);
    } catch (error) {
      showToast({ tone: "danger", title: error.message || "Failed to update category." });
    }
  };

  const confirmDeleteAnimal = (animal) => {
    confirm({
      title: "Delete this animal?",
      description: "This will remove it from the backend list.",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
      tone: "danger",
      onConfirm: async () => {
        try {
          await adminApi(`/animals/delete-animals/${animal._id}`, {
            method: "DELETE",
          });
          const data = await adminApi("/animals/get-animals?includeInactive=true");
          setAnimalRows(data.animals || []);
          showToast({ tone: "success", title: "Animal deleted." });
        } catch (error) {
          showToast({ tone: "danger", title: error.message || "Failed to delete animal." });
        }
      },
    });
  };

  const confirmDeleteCategory = (category) => {
    confirm({
      title: "Delete this category?",
      description: "This will remove it from the backend list.",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
      tone: "danger",
      onConfirm: async () => {
        try {
          await adminApi(`/categories/delete-category/${category.slug}`, {
            method: "DELETE",
          });
          const data = await adminApi("/categories/get-categories");
          setCategoryRows(data.categories || []);
          showToast({ tone: "success", title: "Category deleted." });
        } catch (error) {
          showToast({ tone: "danger", title: error.message || "Failed to delete category." });
        }
      },
    });
  };

  return (
    <DashboardShell activeItem="Categories">
      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
              Categories
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
              Category List
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
              Review categories under each animal and turn each category on or off
              from one place.
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="flex items-center justify-end gap-2">
              <Link
                href="/dashboard/categories/create-animal"
                className="inline-flex h-9 items-center rounded-xl bg-main px-3 text-xs font-black text-white transition hover:bg-mainHover"
              >
                Create Animal
              </Link>
              <Link
                href="/dashboard/categories/create"
                className="inline-flex h-9 items-center rounded-xl bg-main px-3 text-xs font-black text-white transition hover:bg-mainHover"
              >
                Create Category
              </Link>
            </div>
            <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-main/80">
              Search categories
            </label>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by category, animal, slug, or ID"
              className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
        <div className="border-b border-neutral-100 bg-mainSoft/40 px-5 py-3">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-main/60">
            Animals
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="bg-mainSoft/25">
              <tr className="border-b border-neutral-100 text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                <th className="px-8 py-4">Animal</th>
                <th className="px-8 py-4">Slug</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnimals.map((animal) => (
                <tr key={animal._id} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-8 py-5 text-sm font-black text-main">{animal.name}</td>
                  <td className="px-8 py-5 text-sm font-semibold text-slate-500">
                    {animal.slug}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <StatusToggle
                      on={animal.isActive}
                      onToggle={() => toggleAnimalStatus(animal)}
                    />
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button
                      type="button"
                      onClick={() => confirmDeleteAnimal(animal)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                      aria-label={`Delete ${animal.name}`}
                    >
                      <Icon name="trash" className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
        <div className="border-b border-neutral-100 bg-mainSoft/40 px-5 py-3">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-main/60">
            Categories
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead className="bg-mainSoft/25">
              <tr className="border-b border-neutral-100 text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                <th className="px-8 py-4">Image</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Animal</th>
                <th className="px-8 py-4">Slug</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4">Last Update</th>
                <th className="px-8 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((item) => (
                <tr key={item._id} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-8 py-5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-mainSoft text-xs font-black text-main">
                      {(item.image || item.name || "C").slice(0, 2).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-main">{item.name}</td>
                  <td className="px-8 py-5 text-sm font-semibold text-slate-600">
                    {item.animalName}
                  </td>
                  <td className="px-8 py-5 text-sm font-semibold text-slate-500">
                    {item.slug}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <StatusToggle
                      on={item.isActive}
                      onToggle={() => toggleCategoryStatus(item)}
                    />
                  </td>
                  <td className="px-8 py-5 text-sm font-semibold text-slate-500">
                    {item.updatedAt
                      ? new Date(item.updatedAt).toLocaleDateString()
                      : loading
                        ? "Loading..."
                        : "—"}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button
                      type="button"
                      onClick={() => confirmDeleteCategory(item)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                      aria-label={`Delete ${item.name}`}
                    >
                      <Icon name="trash" className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
