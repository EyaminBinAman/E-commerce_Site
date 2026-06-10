"use client";

import Link from "next/link";

import DashboardShell from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";

const suggestedBrands = ["Royal Canin", "Whiskas", "Pedigree", "Tetra"];

export default function CreateBrandDashboard({ mode = "create" }) {
  const isUpdate = mode === "update";
  const { showToast } = useToast();

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
          {isUpdate ? "Update Brand" : "Create Brand"}
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          {isUpdate
            ? "Update brand details, animal mapping, image, and visibility status."
            : "Add a brand with its image, choose the animal it belongs to, add a slug, and control visibility with status."}
        </p>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wide text-main/80">
                Brand name
              </label>
              <input
                type="text"
                placeholder="1kg Beef Flavour for Adult Dogs"
                list="brand-name-list"
                defaultValue={isUpdate ? "Whiskas" : ""}
                className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
              />
              <datalist id="brand-name-list">
                <option value="1kg Beef Flavour for Adult Dogs" />
                <option value="10L Odorless Cat Litter" />
                <option value="Whiskas" />
                <option value="1.5kg Salmon Flavour for Adult Cat" />
                <option value="Lavender Flavour Cat Litter 5L" />
                <option value="1kg Beef Flavour for Puppy Dogs" />
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wide text-main/80">
                Brand image
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

            <div>
              <label className="block text-xs font-black uppercase tracking-wide text-main/80">
                Animal
              </label>
              <select className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-main">
                <option>{isUpdate ? "Cat" : "Select an animal"}</option>
                <option>Dog</option>
                <option>Cat</option>
                <option>Bird</option>
                <option>Rabbit</option>
              </select>
            </div>

            <label className="inline-flex items-center gap-2 pt-1 text-sm font-semibold text-slate-600">
              <input
                type="checkbox"
                defaultChecked={isUpdate ? false : true}
                className="h-4 w-4 accent-[#173F31]"
              />
              Brand is active
            </label>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-main/60">
              Suggested Brands
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedBrands.map((item) => (
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
              Brand Note
            </p>
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-500">
              <li>Each brand belongs to one animal group only.</li>
              <li>The slug updates automatically from the brand name when saved.</li>
              <li>Uploading a new image will replace the brand preview used in the admin list.</li>
            </ul>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-lg shadow-main/5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  showToast({
                    tone: "success",
                    title: isUpdate
                      ? "Brand updated successfully."
                      : "Brand created successfully.",
                  })
                }
                className="h-10 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover"
              >
                {isUpdate ? "Update Brand" : "Create Brand"}
              </button>
              <Link
                href="/dashboard/brands"
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
