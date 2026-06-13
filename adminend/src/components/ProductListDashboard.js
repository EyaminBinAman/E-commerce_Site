"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import { adminApi } from "@/lib/adminApi";

const ITEMS_PER_PAGE = 10;

function MiniToggle({ on, onToggle, tone = "green" }) {
  const toneStyles = {
    green: on ? "border-main/30 bg-mainSoft" : "border-red-200 bg-red-100",
    yellow: on ? "border-amber-300 bg-amber-100" : "border-red-200 bg-red-100",
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${toneStyles[tone]}`}
    >
      <span className="absolute inset-0 rounded-full bg-white/35" />
      <span
        className={`relative inline-flex h-4 w-4 items-center justify-center rounded-full text-white shadow-sm transition-transform ${
          on ? "translate-x-4 bg-main" : "translate-x-0.5 bg-red-500"
        }`}
      >
        <Icon name={on ? "check" : "x"} className="h-2 w-2" />
      </span>
    </button>
  );
}

function normalizeProduct(product) {
  const categoryName = product.category?.name || "Uncategorized";
  const brandName = product.brand?.name || "No brand";
  const imageLabel = (product.images?.[0] || product.name || "PR").slice(0, 2).toUpperCase();

  return {
    id: product._id,
    slug: product.slug,
    imageLabel,
    name: product.name,
    brand: brandName,
    category: categoryName,
    stockQuantity: product.stockQuantity ?? 0,
    isActive: !!product.isActive,
    isOfferEnabled: !!product.isOfferEnabled,
    isOutOfStock: !!product.isOutOfStock,
    price: product.price ?? 0,
    discountPrice: product.discountPrice,
    discountPercentage: product.discountPercentage ?? 0,
    updatedAt: product.updatedAt,
  };
}

export default function ProductListDashboard() {
  const { showToast, confirm } = useToast();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadProducts() {
      try {
        const data = await adminApi("/products/get-products?limit=100");
        if (alive) {
          setProducts((data.products || []).map(normalizeProduct));
        }
      } catch (error) {
        showToast({
          tone: "danger",
          title: error.message || "Failed to load products.",
        });
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      alive = false;
    };
  }, [showToast]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return products;
    }

    return products.filter((item) =>
      [item.name, item.brand, item.category, item.slug]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [products, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const pageProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const toggleField = (product, field, value) => {
    adminApi(`/products/update-product/${product.slug}`, {
      method: "PATCH",
      body: JSON.stringify({ [field]: value }),
    })
      .then((data) => {
        const updated = normalizeProduct(data.product);
        setProducts((prev) =>
          prev.map((item) => (item.slug === product.slug ? updated : item))
        );
        showToast({ tone: "success", title: "Product updated." });
      })
      .catch((error) => {
        showToast({
          tone: "danger",
          title: error.message || "Failed to update product.",
        });
      });
  };

  const confirmDeleteProduct = (product) => {
    confirm({
      title: `Delete ${product.name}?`,
      description: "This will soft delete the product on the backend.",
      confirmLabel: "Delete",
      tone: "danger",
      onConfirm: () => {
        adminApi(`/products/delete-product/${product.slug}`, {
          method: "DELETE",
        })
          .then(() => {
            setProducts((prev) =>
              prev.filter((item) => item.slug !== product.slug)
            );
            showToast({ tone: "success", title: "Product deleted." });
          })
          .catch((error) => {
            showToast({
              tone: "danger",
              title: error.message || "Failed to delete product.",
            });
          });
      },
    });
  };

  const totals = useMemo(() => {
    return {
      total: products.length,
      outOfStock: products.filter((item) => item.isOutOfStock).length,
      featured: products.filter((item) => item.isOfferEnabled).length,
    };
  }, [products]);

  const goToPage = (page) => {
    setCurrentPage(Math.min(totalPages, Math.max(1, page)));
  };

  return (
    <DashboardShell activeItem="Products">
      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
              Products
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
              Product List
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
              Live products from the backend.
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="flex justify-end">
              <Link
                href="/dashboard/products/create"
                className="inline-flex h-9 items-center rounded-xl bg-main px-4 text-xs font-black text-white transition hover:bg-mainHover"
              >
                Create Product
              </Link>
            </div>
            <label className="mt-3 block text-xs font-bold uppercase tracking-wide text-main/80">
              Search products
            </label>
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, brand, category, or slug"
              className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-300 focus:border-main"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <article className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-md shadow-main/5 ring-1 ring-main/15">
          <div className="mb-2 h-1.5 rounded-full bg-gradient-to-r from-main to-main/70" />
          <p className="text-sm font-extrabold text-slate-500">Total Products</p>
          <p className="mt-1 text-3xl font-black text-main">{totals.total}</p>
        </article>
        <article className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-md shadow-main/5 ring-1 ring-accent/20">
          <div className="mb-2 h-1.5 rounded-full bg-gradient-to-r from-accent to-accentSoft" />
          <p className="text-sm font-extrabold text-slate-500">Out of Stock</p>
          <p className="mt-1 text-3xl font-black text-main">{totals.outOfStock}</p>
        </article>
        <article className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-md shadow-main/5 ring-1 ring-amber-200">
          <div className="mb-2 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300" />
          <p className="text-sm font-extrabold text-slate-500">Offers Enabled</p>
          <p className="mt-1 text-3xl font-black text-main">{totals.featured}</p>
        </article>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-left">
            <thead className="bg-mainSoft/30">
              <tr className="border-b border-neutral-100 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                <th className="w-20 px-2 py-2">Product</th>
                <th className="w-40 px-2 py-2">Brand</th>
                <th className="w-32 px-2 py-2">Category</th>
                <th className="w-16 px-2 py-2 text-center">Stock</th>
                <th className="w-12 px-1 py-2 text-center">Active</th>
                <th className="w-12 px-1 py-2 text-center">Offer</th>
                <th className="w-20 px-2 py-2">Price</th>
                <th className="w-16 px-2 py-2">Updated</th>
                <th className="w-14 px-1 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm font-semibold text-slate-500">
                    Loading products...
                  </td>
                </tr>
              ) : pageProducts.length ? (
                pageProducts.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-100 last:border-b-0">
                    <td className="px-2 py-2.5">
                      <p className="truncate text-[11px] font-black text-main">{item.name}</p>
                      <p className="mt-0.5 truncate text-[9px] font-semibold text-slate-400">
                        {item.slug}
                      </p>
                    </td>
                    <td className="px-2 py-2.5 text-[11px] font-semibold text-slate-600">{item.brand}</td>
                    <td className="px-2 py-2.5 text-[11px] font-semibold text-slate-600">{item.category}</td>
                    <td className="px-2 py-2.5 text-center text-[11px] font-black text-slate-700">
                      {item.stockQuantity}
                    </td>
                    <td className="px-1 py-2.5 text-center">
                      <MiniToggle
                        on={item.isActive}
                        onToggle={() => toggleField(item, "isActive", !item.isActive)}
                      />
                    </td>
                    <td className="px-1 py-2.5 text-center">
                      <MiniToggle
                        tone="yellow"
                        on={item.isOfferEnabled}
                        onToggle={() => toggleField(item, "isOfferEnabled", !item.isOfferEnabled)}
                      />
                    </td>
                    <td className="px-2 py-2.5 text-[11px] font-black text-main">
                      ৳ {item.discountPrice ?? item.price}
                    </td>
                    <td className="px-2 py-2.5 text-[10px] font-semibold text-slate-500">
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-1 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/dashboard/products/update?slug=${encodeURIComponent(item.slug)}`}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-main/20 bg-mainSoft text-main transition hover:bg-mainSoft/70"
                          aria-label={`Edit ${item.name}`}
                        >
                          <Icon name="edit" className="h-3 w-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => confirmDeleteProduct(item)}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                          aria-label={`Delete ${item.name}`}
                        >
                          <Icon name="trash" className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm font-semibold text-slate-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 px-3 py-2.5">
          <p className="text-[11px] font-semibold text-slate-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of{" "}
            {filteredProducts.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-7 rounded-md border border-neutral-200 px-2 text-[11px] font-black text-slate-600 transition hover:border-main hover:text-main disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  type="button"
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`h-7 min-w-7 rounded-md px-2 text-[11px] font-black transition ${
                    page === currentPage
                      ? "bg-main text-white"
                      : "border border-neutral-200 text-slate-600 hover:border-main hover:text-main"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-7 rounded-md border border-neutral-200 px-2 text-[11px] font-black text-slate-600 transition hover:border-main hover:text-main disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
