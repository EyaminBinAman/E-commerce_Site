"use client";

import Link from "next/link";
import { useState } from "react";

import DashboardShell, { Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";

const initialBrands = [
  { id: "BR-001", logo: "SH", name: "Smart Heart", animal: "Birds", slug: "smart-heart-birds", active: true, updated: "6/9/2026" },
  { id: "BR-002", logo: "GW", name: "Gold Wings", animal: "Birds", slug: "gold-wings-birds", active: true, updated: "6/9/2026" },
  { id: "BR-003", logo: "QK", name: "Quik", animal: "Birds", slug: "quik-birds", active: false, updated: "6/9/2026" },
  { id: "BR-004", logo: "SH", name: "Smart Heart", animal: "Dog", slug: "smart-heart-dog", active: false, updated: "6/9/2026" },
  { id: "BR-005", logo: "JG", name: "Jungle", animal: "Cat", slug: "jungle-cat", active: false, updated: "6/9/2026" },
  { id: "BR-006", logo: "WK", name: "Whiskas", animal: "Dog", slug: "whiskas-dog", active: false, updated: "6/9/2026" },
  { id: "BR-007", logo: "TH", name: "Taihi", animal: "Cat", slug: "taihi-cat", active: false, updated: "6/9/2026" },
  { id: "BR-008", logo: "WK", name: "Whiskas", animal: "Cat", slug: "whiskas-cat", active: false, updated: "6/9/2026" },
  { id: "BR-009", logo: "RF", name: "Reflex", animal: "Cat", slug: "reflex-cat", active: false, updated: "6/9/2026" },
];

function BrandToggle({ on, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-wide transition ${
        on ? "border-main/25 bg-mainSoft text-main" : "border-slate-300 bg-slate-100 text-slate-500"
      }`}
    >
      <span className="relative inline-flex h-4 w-9 items-center">
        <span className="absolute inset-0 rounded-full bg-white/55" />
        <span
          className={`absolute inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-white transition-transform ${
            on ? "translate-x-5 bg-main" : "translate-x-0.5 bg-slate-500"
          }`}
        >
          <Icon name={on ? "check" : "x"} className="h-2 w-2" />
        </span>
      </span>
      {on ? "On" : "Off"}
    </button>
  );
}

export default function BrandListDashboard() {
  const { showToast, confirm } = useToast();
  const [brands, setBrands] = useState(initialBrands);

  const toggleStatus = (id) => {
    setBrands((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const confirmDeleteBrand = (id, name) => {
    confirm({
      title: `Delete ${name}?`,
      description: "This demo will remove it from the list.",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
      tone: "danger",
      onConfirm: () => {
        setBrands((prev) => prev.filter((item) => item.id !== id));
        showToast({ tone: "success", title: "Brand deleted." });
      },
    });
  };

  return (
    <DashboardShell activeItem="Brands">
      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
              Brands
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
              Brand List
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
              Manage brand visibility, animal grouping, and slug identity from one place.
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="flex justify-end">
              <Link
                href="/dashboard/brands/create"
                className="inline-flex h-9 items-center rounded-xl bg-main px-4 text-xs font-black text-white transition hover:bg-mainHover"
              >
                Create Brand
              </Link>
            </div>
            <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-main/80">
              Search brands
            </label>
            <input
              type="search"
              placeholder="Search by brand name, animal, slug, or ID"
              className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-mainSoft/30">
              <tr className="border-b border-neutral-100 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                <th className="px-4 py-3">Brand</th>
                <th className="px-3 py-3">Animal</th>
                <th className="px-3 py-3">Slug</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3">Update</th>
                <th className="px-3 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((item) => (
                <tr key={item.id} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-mainSoft text-[10px] font-black text-main">
                        {item.logo}
                      </span>
                      <span className="truncate text-sm font-black text-main">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-sm font-semibold text-slate-600">{item.animal}</td>
                  <td className="px-3 py-3.5 text-sm font-semibold text-slate-500">{item.slug}</td>
                  <td className="px-3 py-3.5 text-center">
                    <BrandToggle on={item.active} onToggle={() => toggleStatus(item.id)} />
                  </td>
                  <td className="px-3 py-3.5 text-xs font-semibold text-slate-500">{item.updated}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href="/dashboard/brands/update"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-main/20 bg-mainSoft text-main transition hover:bg-mainSoft/70"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Icon name="edit" className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => confirmDeleteBrand(item.id, item.name)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Icon name="trash" className="h-3.5 w-3.5" />
                      </button>
                    </div>
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
