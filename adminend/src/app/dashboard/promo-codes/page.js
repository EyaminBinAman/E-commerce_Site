"use client";

import { useMemo, useRef, useState } from "react";

import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";

const initialPromoCodes = [
  {
    id: "PC-1001",
    name: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrder: 1000,
    maxAmount: 250,
    scopeType: "all",
    totalUsageLimit: 500,
    usageCount: 128,
    usageLimitPerUser: 1,
    startDate: "2026-06-01",
    expiryDate: "2026-07-15",
    isActive: true,
  },
  {
    id: "PC-1002",
    name: "CATFOOD50",
    discountType: "amount",
    discountValue: 50,
    minOrder: 600,
    maxAmount: null,
    scopeType: "products",
    totalUsageLimit: 150,
    usageCount: 42,
    usageLimitPerUser: 2,
    startDate: "2026-06-05",
    expiryDate: "2026-06-30",
    isActive: true,
  },
  {
    id: "PC-1003",
    name: "SUMMER5",
    discountType: "percentage",
    discountValue: 5,
    minOrder: 300,
    maxAmount: 100,
    scopeType: "new-users",
    totalUsageLimit: 1000,
    usageCount: 701,
    usageLimitPerUser: 1,
    startDate: "2026-05-20",
    expiryDate: "2026-06-22",
    isActive: false,
  },
];

const scopeLabels = {
  all: "All items",
  items: "Selected items",
  categories: "Categories",
  products: "Products",
  users: "Users",
  "new-users": "New users",
};

const initialForm = {
  name: "",
  discountType: "percentage",
  discountValue: "10",
  minOrder: "0",
  maxAmount: "",
  scopeType: "all",
  totalUsageLimit: "",
  usageLimitPerUser: "1",
  startDate: "2026-06-12",
  expiryDate: "2026-07-12",
};

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function PromoTable({ title, items, onToggle, onDelete, onEdit }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
      <div className="border-b border-neutral-100 px-5 py-4">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
          {title}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead className="bg-mainSoft/30">
            <tr className="border-b border-neutral-100 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Scope</th>
              <th className="px-4 py-3">Usage</th>
              <th className="px-4 py-3 text-center">State</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-neutral-100 last:border-b-0">
                <td className="px-4 py-4">
                  <p className="text-sm font-black text-main">{item.name}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">
                    {item.id}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-black text-slate-700">
                    {item.discountType === "percentage"
                      ? `${item.discountValue}%`
                      : `৳ ${item.discountValue}`}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">
                    Min ৳ {item.minOrder}
                    {item.maxAmount ? ` · Max ৳ ${item.maxAmount}` : ""}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-slate-600">
                    {scopeLabels[item.scopeType]}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">
                    {item.usageLimitPerUser} use per customer
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-black text-slate-700">
                    {item.usageCount}/{item.totalUsageLimit ?? "∞"}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">
                    {item.startDate} to {item.expiryDate}
                  </p>
                </td>
                <td className="px-4 py-4 text-center">
                  <button type="button" onClick={() => onToggle(item.id)} className="inline-flex">
                    <Badge tone={item.isActive ? "green" : "gray"}>
                      {item.isActive ? "Active" : "Paused"}
                    </Badge>
                  </button>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-main/15 bg-mainSoft px-3 text-xs font-black text-main transition hover:bg-mainSoft/70"
                      onClick={() => onEdit(item.name)}
                      >
                      <Icon name="edit" className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id, item.name)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-black text-red-600 transition hover:bg-red-100"
                    >
                      <Icon name="trash" className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function PromoCodesPage() {
  const { showToast, confirm } = useToast();
  const [promoCodes, setPromoCodes] = useState(initialPromoCodes);
  const [form, setForm] = useState(initialForm);
  const [showCreate, setShowCreate] = useState(false);
  const createRef = useRef(null);

  const summary = useMemo(() => {
    const active = promoCodes.filter((item) => item.isActive).length;
    return { active, total: promoCodes.length };
  }, [promoCodes]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToCreate = () => {
    setShowCreate(true);
    createRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      showToast({ tone: "warning", title: "Promo code name is required." });
      return;
    }

    const nextPromo = {
      id: `PC-${String(promoCodes.length + 1001).padStart(4, "0")}`,
      name: form.name.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: toNumber(form.discountValue, 0),
      minOrder: toNumber(form.minOrder, 0),
      maxAmount: form.maxAmount ? toNumber(form.maxAmount, null) : null,
      scopeType: form.scopeType,
      totalUsageLimit: form.totalUsageLimit
        ? toNumber(form.totalUsageLimit, null)
        : null,
      usageCount: 0,
      usageLimitPerUser: toNumber(form.usageLimitPerUser, 1),
      startDate: form.startDate,
      expiryDate: form.expiryDate,
      isActive: true,
    };

    setPromoCodes((prev) => [nextPromo, ...prev]);
    setForm(initialForm);
    showToast({ tone: "success", title: "Promo code created." });
  };

  const togglePromo = (id) => {
    setPromoCodes((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    );
  };

  const deletePromo = (id, name) => {
    confirm({
      title: `Delete ${name}?`,
      description: "This removes the code from the admin list.",
      confirmLabel: "Delete",
      tone: "danger",
      onConfirm: () => {
        setPromoCodes((prev) => prev.filter((item) => item.id !== id));
        showToast({ tone: "success", title: "Promo code deleted." });
      },
    });
  };

  const editPromo = (name) => {
    showToast({
      tone: "info",
      title: `${name} is ready for editing.`,
    });
  };

  return (
    <DashboardShell activeItem="Promo Codes">
      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
          Marketing
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
          Promo Codes
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          Browse the promo list first, then jump to the create form below when
          you need a new code.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <article className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-md shadow-main/5 ring-1 ring-main/15">
          <div className="mb-2 h-1.5 rounded-full bg-gradient-to-r from-main to-main/70" />
          <p className="text-sm font-extrabold text-slate-500">Active Codes</p>
          <p className="mt-1 text-3xl font-black text-main">{summary.active}</p>
        </article>
        <article className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-md shadow-main/5 ring-1 ring-slate-200">
          <div className="mb-2 h-1.5 rounded-full bg-gradient-to-r from-slate-400 to-slate-300" />
          <p className="text-sm font-extrabold text-slate-500">Total Codes</p>
          <p className="mt-1 text-3xl font-black text-main">{summary.total}</p>
        </article>
      </div>

      <div className="mt-5 space-y-5">
        <PromoTable
          title="Promo list"
          items={promoCodes}
          onToggle={togglePromo}
          onDelete={deletePromo}
          onEdit={editPromo}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={scrollToCreate}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover"
          >
            <Icon name="send" className="h-4 w-4" />
            Create code
          </button>
        </div>

        {showCreate ? (
          <section
            ref={createRef}
            id="create-code"
            className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
                  Create Code
                </p>
                <h2 className="mt-2 text-xl font-black text-main">
                  New promo code
                </h2>
              </div>
              <Icon name="ticket" className="h-6 w-6 text-main/70" />
            </div>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Code name" name="name" value={form.name} onChange={handleChange} placeholder="WELCOME10" />
              <Field label="Discount type" name="discountType" value={form.discountType} onChange={handleChange} as="select" options={[["percentage", "Percentage"], ["amount", "Amount"]]} />
              <Field label="Discount value" name="discountValue" value={form.discountValue} onChange={handleChange} type="number" min="0" />
              <Field label="Minimum order" name="minOrder" value={form.minOrder} onChange={handleChange} type="number" min="0" />
              <Field label="Max amount" name="maxAmount" value={form.maxAmount} onChange={handleChange} type="number" min="0" />
              <Field label="Scope" name="scopeType" value={form.scopeType} onChange={handleChange} as="select" options={Object.entries(scopeLabels).map(([value, label]) => [value, label])} />
              <Field label="Usage limit per user" name="usageLimitPerUser" value={form.usageLimitPerUser} onChange={handleChange} type="number" min="1" />
              <Field label="Total usage limit" name="totalUsageLimit" value={form.totalUsageLimit} onChange={handleChange} type="number" min="1" />
              <Field label="Start date" name="startDate" value={form.startDate} onChange={handleChange} type="date" />
              <Field label="Expiry date" name="expiryDate" value={form.expiryDate} onChange={handleChange} type="date" />

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover"
                >
                  <Icon name="check" className="h-4 w-4" />
                  Save code
                </button>
              </div>
            </form>
          </section>
        ) : null}
      </div>
    </DashboardShell>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  as = "input",
  options = [],
  min,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-main/75">
        {label}
      </span>
      {as === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-main"
        >
          {options.map(([optionValue, optionLabel]) => (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          min={min}
          placeholder={placeholder}
          className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-main"
        />
      )}
    </label>
  );
}
