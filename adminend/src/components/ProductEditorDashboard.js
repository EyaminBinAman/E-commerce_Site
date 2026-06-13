"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import DashboardShell from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import { adminApi } from "@/lib/adminApi";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  discountPrice: "",
  stockQuantity: "",
  tags: "",
  images: "",
};

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
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isUpdate && !!slug);
  const [saving, setSaving] = useState(false);
  const [offerEnabled, setOfferEnabled] = useState(false);
  const [markStockOut, setMarkStockOut] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (!isUpdate || !slug) {
      return;
    }

    adminApi(`/products/get-product/${slug}`)
      .then((data) => {
        const product = data.product;
        if (!product) {
          throw new Error("Product not found");
        }

        setForm({
          name: product.name || "",
          description: product.description || "",
          category: product.category?.slug || product.category?.name || "",
          brand: product.brand?.slug || product.brand?.name || "",
          price: String(product.price ?? ""),
          discountPrice: String(product.discountPrice ?? ""),
          stockQuantity: String(product.stockQuantity ?? ""),
          tags: (product.tags || []).join(", "),
          images: (product.images || []).join(", "),
        });
        setOfferEnabled(!!product.isOfferEnabled);
        setMarkStockOut(!!product.isOutOfStock);
        setIsActive(!!product.isActive);
        setIsFeatured(!!product.isFeatured);
      })
      .catch((error) => {
        showToast({
          tone: "danger",
          title: error.message || "Failed to load product.",
        });
      })
      .finally(() => setLoading(false));
  }, [isUpdate, slug, showToast]);

  const title = useMemo(
    () => (isUpdate ? "Update Product" : "Create Product"),
    [isUpdate]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProduct = () => {
    if (!form.name.trim() || !form.description.trim() || !form.category.trim() || !form.brand.trim()) {
      showToast({
        tone: "warning",
        title: "Name, description, category, and brand are required.",
      });
      return;
    }

    if (!form.price || !form.stockQuantity) {
      showToast({
        tone: "warning",
        title: "Price and stock quantity are required.",
      });
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      brand: form.brand.trim(),
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stockQuantity: Number(form.stockQuantity),
      tags: form.tags,
      images: form.images,
      isActive,
      isFeatured,
      isOfferEnabled: offerEnabled,
    };

    if (markStockOut) {
      payload.stockQuantity = 0;
    }

    const request = isUpdate && slug
      ? adminApi(`/products/update-product/${slug}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : adminApi("/products/create-product", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    request
      .then(() => {
        showToast({
          tone: "success",
          title: isUpdate ? "Product updated successfully." : "Product created successfully.",
        });
      })
      .catch((error) => {
        showToast({
          tone: "danger",
          title: error.message || "Failed to save product.",
        });
      })
      .finally(() => setSaving(false));
  };

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
            <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
              Products
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
              {title}
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
              {loading ? "Loading product..." : "Connected to the backend product routes."}
            </p>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <div className="space-y-4">
              <Field label="Product Name">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Premium Puppy Food"
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                />
              </Field>

              <Field label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the product, benefits, ingredients, or use case."
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                />
              </Field>

              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Category">
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    type="text"
                    placeholder="Dog Food"
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                  />
                </Field>
                <Field label="Brand">
                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    type="text"
                    placeholder="Smart Heart"
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                  />
                </Field>
                <Field label="Price">
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    type="number"
                    placeholder="450"
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                  />
                </Field>
                <Field label="Discount Price">
                  <input
                    name="discountPrice"
                    value={form.discountPrice}
                    onChange={handleChange}
                    type="number"
                    placeholder="400"
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                  />
                </Field>
                <Field label="Stock Quantity">
                  <input
                    name="stockQuantity"
                    value={form.stockQuantity}
                    onChange={handleChange}
                    type="number"
                    placeholder="24"
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                  />
                </Field>
                <Field label="Tags">
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    type="text"
                    placeholder="food, puppy, dog"
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
                  />
                </Field>
                <Field label="Images">
                  <input
                    name="images"
                    value={form.images}
                    onChange={handleChange}
                    type="text"
                    placeholder="/uploads/products/example.png"
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main md:col-span-2"
                  />
                </Field>
              </div>
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
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={() => setIsFeatured((v) => !v)}
                  className="h-4 w-4 accent-[#173F31]"
                />
                Product is featured
              </label>
            </div>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-main/60">
              Pricing Note
            </p>
            <ul className="mt-3 space-y-2 text-sm font-semibold leading-6 text-slate-500">
              <li>Category and brand can be entered by name or slug.</li>
              <li>Product stock out is derived from stock quantity.</li>
              <li>Images and tags accept comma-separated values.</li>
            </ul>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white p-4 shadow-lg shadow-main/5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={saveProduct}
                disabled={saving || loading}
                className="h-10 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : isUpdate ? "Update Product" : "Create Product"}
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
