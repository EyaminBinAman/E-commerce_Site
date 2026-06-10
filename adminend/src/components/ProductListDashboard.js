"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import DashboardShell, { Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";

const initialProducts = [
  {
    id: "PRD-000023",
    image: "DP",
    name: "1kg Beef Flavour for Puppy Dogs",
    brand: "Smart Heart",
    category: "Dog Food",
    animal: "Dog",
    quantity: "1 pack",
    active: true,
    offer: true,
    stockOut: false,
    buyPrice: "400",
    sellPrice: "450",
    discount: "0%",
    reviews: "8.0/10",
    updated: "6/9/2026",
  },
  {
    id: "PRD-000012",
    image: "CF",
    name: "Chicken Flavour Cat Food",
    brand: "Smart Heart",
    category: "Cat Food",
    animal: "Cat",
    quantity: "20 pack",
    active: true,
    offer: true,
    stockOut: false,
    buyPrice: "400",
    sellPrice: "500",
    discount: "0%",
    reviews: "9.0/10",
    updated: "6/8/2026",
  },
  {
    id: "PRD-000011",
    image: "RF",
    name: "1 kg Rabbit Food",
    brand: "Smart Heart",
    category: "Rabbit Food",
    animal: "Rabbit",
    quantity: "20 pack",
    active: true,
    offer: true,
    stockOut: true,
    buyPrice: "299.99",
    sellPrice: "400",
    discount: "0%",
    reviews: "8.0/10",
    updated: "6/5/2026",
  },
  {
    id: "PRD-000010",
    image: "RB",
    name: "1kg Rabbit Food",
    brand: "Jungle",
    category: "Rabbit Food",
    animal: "Rabbit",
    quantity: "20 pack",
    active: true,
    offer: true,
    stockOut: false,
    buyPrice: "400",
    sellPrice: "500",
    discount: "5%",
    reviews: "6.0/10",
    updated: "6/9/2026",
  },
  {
    id: "PRD-000009",
    image: "DF",
    name: "2kg Adult Dog Food",
    brand: "Smart Heart",
    category: "Dog Food",
    animal: "Dog",
    quantity: "12 pack",
    active: true,
    offer: false,
    stockOut: false,
    buyPrice: "520",
    sellPrice: "610",
    discount: "2%",
    reviews: "7.8/10",
    updated: "6/8/2026",
  },
  {
    id: "PRD-000008",
    image: "CL",
    name: "Cat Litter 10L",
    brand: "Jungle",
    category: "Cat Litter",
    animal: "Cat",
    quantity: "15 pack",
    active: true,
    offer: true,
    stockOut: false,
    buyPrice: "350",
    sellPrice: "430",
    discount: "3%",
    reviews: "8.5/10",
    updated: "6/8/2026",
  },
  {
    id: "PRD-000007",
    image: "BT",
    name: "Bird Seed Mix",
    brand: "Smart Heart",
    category: "Bird Food",
    animal: "Bird",
    quantity: "8 pack",
    active: true,
    offer: false,
    stockOut: true,
    buyPrice: "190",
    sellPrice: "240",
    discount: "0%",
    reviews: "7.2/10",
    updated: "6/7/2026",
  },
  {
    id: "PRD-000006",
    image: "RT",
    name: "Rabbit Treat Pack",
    brand: "Jungle",
    category: "Rabbit Food",
    animal: "Rabbit",
    quantity: "10 pack",
    active: true,
    offer: true,
    stockOut: false,
    buyPrice: "260",
    sellPrice: "320",
    discount: "5%",
    reviews: "8.1/10",
    updated: "6/7/2026",
  },
  {
    id: "PRD-000005",
    image: "PF",
    name: "Puppy Starter Food",
    brand: "Smart Heart",
    category: "Dog Food",
    animal: "Dog",
    quantity: "25 pack",
    active: true,
    offer: true,
    stockOut: false,
    buyPrice: "410",
    sellPrice: "490",
    discount: "4%",
    reviews: "9.1/10",
    updated: "6/6/2026",
  },
  {
    id: "PRD-000004",
    image: "CF",
    name: "Ocean Fish Cat Food",
    brand: "Jungle",
    category: "Cat Food",
    animal: "Cat",
    quantity: "16 pack",
    active: true,
    offer: false,
    stockOut: false,
    buyPrice: "300",
    sellPrice: "360",
    discount: "0%",
    reviews: "7.9/10",
    updated: "6/6/2026",
  },
  {
    id: "PRD-000003",
    image: "DG",
    name: "Dog Biscuit Gravy Mix",
    brand: "Smart Heart",
    category: "Dog Treat",
    animal: "Dog",
    quantity: "18 pack",
    active: true,
    offer: true,
    stockOut: false,
    buyPrice: "280",
    sellPrice: "340",
    discount: "6%",
    reviews: "8.8/10",
    updated: "6/5/2026",
  },
  {
    id: "PRD-000002",
    image: "RM",
    name: "Rabbit Mineral Snack",
    brand: "Jungle",
    category: "Rabbit Food",
    animal: "Rabbit",
    quantity: "6 pack",
    active: false,
    offer: false,
    stockOut: true,
    buyPrice: "210",
    sellPrice: "260",
    discount: "0%",
    reviews: "7.0/10",
    updated: "6/4/2026",
  },
  {
    id: "PRD-000001",
    image: "BD",
    name: "Bird Daily Feed",
    brand: "Smart Heart",
    category: "Bird Food",
    animal: "Bird",
    quantity: "14 pack",
    active: true,
    offer: false,
    stockOut: false,
    buyPrice: "180",
    sellPrice: "225",
    discount: "0%",
    reviews: "7.5/10",
    updated: "6/3/2026",
  },
];

const ITEMS_PER_PAGE = 10;

function MiniToggle({ on, onToggle, tone = "green" }) {
  const toneStyles = {
    green: on
      ? "border-main/30 bg-mainSoft"
      : "border-red-200 bg-red-100",
    yellow: on
      ? "border-amber-300 bg-amber-100"
      : "border-red-200 bg-red-100",
    gray: on
      ? "border-slate-300 bg-slate-100"
      : "border-red-200 bg-red-100",
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

export default function ProductListDashboard() {
  const { showToast, confirm } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);

  const totals = useMemo(() => {
    const outOfStock = products.filter((item) => item.stockOut).length;
    const lowStock = 1;
    return {
      total: products.length,
      outOfStock,
      lowStock,
    };
  }, [products]);

  const toggleField = (id, field) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      )
    );
  };

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const pageProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  const goToPage = (page) => {
    setCurrentPage(Math.min(totalPages, Math.max(1, page)));
  };

  const confirmDeleteProduct = (id, name) => {
    confirm({
      title: `Delete ${name}?`,
      description: "This demo will remove it from the list.",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
      tone: "danger",
      onConfirm: () => {
        setProducts((prev) => prev.filter((item) => item.id !== id));
        showToast({ tone: "success", title: "Product deleted." });
      },
    });
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
              Review product image, name, brand, category, animal, quantity,
              active state, offer, stock-out, pricing, discount, and actions
              from one table.
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
              placeholder="Search by title, brand, category, ID, or SKU"
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
          <p className="mt-1 text-xs font-semibold text-slate-400">
            All products currently available in the catalog.
          </p>
        </article>
        <article className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-md shadow-main/5 ring-1 ring-accent/20">
          <div className="mb-2 h-1.5 rounded-full bg-gradient-to-r from-accent to-accentSoft" />
          <p className="text-sm font-extrabold text-slate-500">Out of Stock</p>
          <p className="mt-1 text-3xl font-black text-main">{totals.outOfStock}</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            Products already marked stock out or with zero quantity.
          </p>
        </article>
        <article className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-md shadow-main/5 ring-1 ring-amber-200">
          <div className="mb-2 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300" />
          <p className="text-sm font-extrabold text-slate-500">Low Stock</p>
          <p className="mt-1 text-3xl font-black text-main">{totals.lowStock}</p>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            Products at or below their own low stock threshold.
          </p>
        </article>
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-left">
            <thead className="bg-mainSoft/30">
              <tr className="border-b border-neutral-100 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                <th className="w-20 px-2 py-2">Product ID</th>
                <th className="w-10 px-1 py-2">Image</th>
                <th className="w-40 px-2 py-2">Product</th>
                <th className="w-20 px-2 py-2">Brand</th>
                <th className="w-20 px-2 py-2">Category</th>
                <th className="w-14 px-2 py-2">Animal</th>
                <th className="w-16 px-2 py-2">Qty</th>
                <th className="w-12 px-1 py-2 text-center">Active</th>
                <th className="w-12 px-1 py-2 text-center">Offer</th>
                <th className="w-14 px-1 py-2 text-center">Stock</th>
                <th className="w-16 px-2 py-2">Buy</th>
                <th className="w-16 px-2 py-2">Sell</th>
                <th className="w-12 px-2 py-2">Disc.</th>
                <th className="hidden 2xl:table-cell w-12 px-2 py-2">Review</th>
                <th className="hidden 2xl:table-cell w-14 px-2 py-2">Update</th>
                <th className="w-14 px-1 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageProducts.map((item) => (
                <tr key={item.id} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-2 py-2.5 text-[10px] font-black text-slate-500">{item.id}</td>
                  <td className="px-1 py-2.5">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-mainSoft text-[8px] font-black text-main">
                      {item.image}
                    </span>
                  </td>
                  <td className="px-2 py-2.5">
                    <p className="truncate text-[11px] font-black text-main">{item.name}</p>
                    <p className="mt-0.5 truncate text-[9px] font-semibold text-slate-400">
                      {item.category.toUpperCase().replace(/\s+/g, "-")}-{item.id.slice(-4)}
                    </p>
                  </td>
                  <td className="px-2 py-2.5 text-[11px] font-semibold text-slate-600">{item.brand}</td>
                  <td className="px-2 py-2.5 text-[11px] font-semibold text-slate-600">{item.category}</td>
                  <td className="px-2 py-2.5 text-[11px] font-semibold text-slate-600">{item.animal}</td>
                  <td className="px-2 py-2.5 text-[11px] font-black text-slate-700">{item.quantity}</td>
                  <td className="px-1 py-2.5 text-center">
                    <MiniToggle on={item.active} onToggle={() => toggleField(item.id, "active")} />
                  </td>
                  <td className="px-1 py-2.5 text-center">
                    <MiniToggle tone="yellow" on={item.offer} onToggle={() => toggleField(item.id, "offer")} />
                  </td>
                  <td className="px-1 py-2.5 text-center">
                    <MiniToggle tone="gray" on={!item.stockOut} onToggle={() => toggleField(item.id, "stockOut")} />
                  </td>
                  <td className="px-2 py-2.5 text-[11px] font-semibold text-slate-600">৳ {item.buyPrice}</td>
                  <td className="px-2 py-2.5 text-[11px] font-black text-main">৳ {item.sellPrice}</td>
                  <td className="px-2 py-2.5 text-[11px] font-semibold text-slate-600">{item.discount}</td>
                  <td className="hidden 2xl:table-cell px-2 py-2.5 text-[10px] font-black text-amber-600">{item.reviews}</td>
                  <td className="hidden 2xl:table-cell px-2 py-2.5 text-[10px] font-semibold text-slate-500">{item.updated}</td>
                  <td className="px-1 py-2.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href="/dashboard/products/update"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-main/20 bg-mainSoft text-main transition hover:bg-mainSoft/70"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Icon name="edit" className="h-3 w-3" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => confirmDeleteProduct(item.id, item.name)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Icon name="trash" className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 px-3 py-2.5">
          <p className="text-[11px] font-semibold text-slate-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, products.length)} of{" "}
            {products.length}
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
