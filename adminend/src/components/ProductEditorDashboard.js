"use client";

import Link from "next/link";
import { useState } from "react";

import DashboardShell from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";

const sampleSku = [
  "DOG-FOOD-3KG-0001",
  "CAT-LITTER-10L-0005",
  "CAT-FOOD-1.5KG-0001",
  "DOG-FOOD-1KG-0003",
  "CAT-LITTER-5L-0001",
  "CAT-FOOD-1KG-0005",
];

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wide text-main/80">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export default function ProductEditorDashboard({ mode = "create" }) {
  const isUpdate = mode === "update";
  const { showToast } = useToast();
  const [offerEnabled, setOfferEnabled] = useState(isUpdate);
  const [markStockOut, setMarkStockOut] = useState(false);
  const [isActive, setIsActive] = useState(true);

  return (
    <DashboardShell activeItem="Products">
      <div className="mb-4">
        <Link
          href="/dashboard/products"
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-main/20 bg-mainSoft px-3 text-sm font-black text-main transition hover:bg-mainSoft/70"
        >
          <span aria-hidden="true">&larr;</span>
          Back to products
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <Field label="Product Name">
              <input
                type="text"
                placeholder="Premium Puppy Food"
                defaultValue={isUpdate ? "1kg Beef Flavour for Puppy Dogs" : ""}
                className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
              />
            </Field>

            <div className="mt-4">
              <Field label="Product Image">
                <div className="flex items-center gap-3">
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
              </Field>
            </div>

            <Field label="Description">
              <textarea
                rows={4}
                placeholder="Describe the product, benefits, ingredients, flavors, or use case."
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
              />
            </Field>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Field label="SKU">
                <input
                  type="text"
                  placeholder="Example: DOG-FOOD-001"
                  defaultValue={isUpdate ? "DOG-FOOD-3KG-0001" : ""}
                  list="product-sku-list"
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                />
                <datalist id="product-sku-list">
                  {sampleSku.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </Field>
              <Field label="Unit">
                <select className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-main">
                  <option>pcs</option>
                  <option>kg</option>
                  <option>pack</option>
                </select>
              </Field>
              <Field label="Animal">
                <select className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-main">
                  <option>{isUpdate ? "Birds" : "Select an animal first"}</option>
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Bird</option>
                  <option>Rabbit</option>
                </select>
              </Field>
              <Field label="Category">
                <select className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-main">
                  <option>{isUpdate ? "Dog Food" : "Select a category"}</option>
                  <option>Dog Food</option>
                  <option>Cat Food</option>
                  <option>Rabbit Food</option>
                </select>
              </Field>
              <Field label="Brand">
                <select className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-main md:col-span-2">
                  <option>{isUpdate ? "Smart Heart" : "Select a brand"}</option>
                  <option>Smart Heart</option>
                  <option>Jungle</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Quantity">
                <input
                  type="number"
                  placeholder="Example: 24"
                  defaultValue={isUpdate ? 1 : ""}
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                />
              </Field>
              <Field label="Low Stock Threshold">
                <input
                  type="number"
                  placeholder="5"
                  defaultValue={isUpdate ? 5 : ""}
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                />
              </Field>
              <Field label="Discount (%)">
                <input
                  type="number"
                  placeholder="0"
                  defaultValue={isUpdate ? 0 : ""}
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                />
              </Field>
              <Field label="Buy Price">
                <input
                  type="number"
                  placeholder="Example: 38"
                  defaultValue={isUpdate ? 400 : ""}
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                />
              </Field>
              <Field label="Sell Price">
                <input
                  type="number"
                  placeholder="Example: 52"
                  defaultValue={isUpdate ? 450 : ""}
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main md:col-span-2"
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-mainSoft/30 p-2">
              <div className="flex h-44 items-center justify-center rounded-xl bg-white text-sm font-black text-main">
                Product Image Preview
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={offerEnabled}
                  onChange={() => setOfferEnabled((v) => !v)}
                  className="h-4 w-4 accent-[#173F31]"
                />
                Offer is enabled
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={markStockOut}
                  onChange={() => setMarkStockOut((v) => !v)}
                  className="h-4 w-4 accent-[#173F31]"
                />
                Mark as stock out
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => setIsActive((v) => !v)}
                  className="h-4 w-4 accent-[#173F31]"
                />
                Product is active
              </label>
            </div>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-main/60">
              Pricing Note
            </p>
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-500">
              <li>Buy price tracks your supplier cost for each product.</li>
              <li>Sell price is the customer-facing base price before discount.</li>
              <li>Low Stock Threshold decides when this appears in low stock view.</li>
              <li>
                Products can only be active when their animal, category, and
                brand are active.
              </li>
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
                      ? "Product updated successfully."
                      : "Product created successfully.",
                  })
                }
                className="h-10 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover"
              >
                {isUpdate ? "Update Product" : "Create Product"}
              </button>
              <Link
                href="/dashboard/products"
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
