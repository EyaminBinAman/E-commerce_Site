"use client";

import { useMemo, useRef, useState } from "react";

import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";

const initialBanners = [
  {
    id: "BN-2001",
    name: "Summer Pet Essentials",
    bannerType: "hero-banner",
    slideNumber: 1,
    isActive: true,
  },
  {
    id: "BN-2002",
    name: "Cat Food Weekend Deal",
    bannerType: "promo-banner",
    slideNumber: 2,
    isActive: true,
  },
  {
    id: "BN-2003",
    name: "Dog Toys Spotlight",
    bannerType: "slider-banner",
    slideNumber: 3,
    isActive: false,
  },
  {
    id: "BN-2004",
    name: "Pet Grooming Hero",
    bannerType: "hero-banner",
    slideNumber: 4,
    isActive: true,
  },
];

const bannerTypeLabels = {
  "hero-banner": "Hero banners",
  "promo-banner": "Promo banners",
  "slider-banner": "Slider banners",
};

const initialForm = {
  name: "",
  bannerType: "hero-banner",
  slideNumber: "1",
};

function groupByType(items) {
  return items.reduce(
    (acc, item) => {
      acc[item.bannerType].push(item);
      return acc;
    },
    { "hero-banner": [], "promo-banner": [], "slider-banner": [] }
  );
}

export default function BannersPage() {
  const { showToast, confirm } = useToast();
  const [banners, setBanners] = useState(initialBanners);
  const [form, setForm] = useState(initialForm);
  const [showCreate, setShowCreate] = useState(false);
  const createRef = useRef(null);

  const grouped = useMemo(() => groupByType(banners), [banners]);
  const summary = useMemo(() => {
    return {
      active: banners.filter((banner) => banner.isActive).length,
      total: banners.length,
    };
  }, [banners]);

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
      showToast({ tone: "warning", title: "Banner name is required." });
      return;
    }

    const nextBanner = {
      id: `BN-${String(banners.length + 2001).padStart(4, "0")}`,
      name: form.name.trim(),
      bannerType: form.bannerType,
      slideNumber: Number(form.slideNumber) || 1,
      isActive: true,
    };

    setBanners((prev) => [...prev, nextBanner].sort((a, b) => a.slideNumber - b.slideNumber));
    setForm(initialForm);
    showToast({ tone: "success", title: "Banner created." });
  };

  const toggleBanner = (id) => {
    setBanners((prev) =>
      prev.map((banner) =>
        banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
      )
    );
  };

  const deleteBanner = (id, name) => {
    confirm({
      title: `Delete ${name}?`,
      description: "This banner will be removed from the admin list.",
      confirmLabel: "Delete",
      tone: "danger",
      onConfirm: () => {
        setBanners((prev) => prev.filter((banner) => banner.id !== id));
        showToast({ tone: "success", title: "Banner deleted." });
      },
    });
  };

  const editBanner = (name) => {
    showToast({ tone: "info", title: `${name} is ready for editing.` });
  };

  return (
    <DashboardShell activeItem="Promo Banners">
      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
          Marketing
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
          Promo Banners
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          Review the three banner groups first, then jump to the create form
          below.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Metric title="Active banners" value={summary.active} note="Currently visible on the storefront." />
        <Metric title="Total banners" value={summary.total} note="All saved banner slots in this admin mockup." />
      </div>

      <div className="mt-5 space-y-5">
        <BannerSection
          title={bannerTypeLabels["hero-banner"]}
          items={grouped["hero-banner"]}
          onToggle={toggleBanner}
          onEdit={editBanner}
          onDelete={deleteBanner}
        />
        <BannerSection
          title={bannerTypeLabels["promo-banner"]}
          items={grouped["promo-banner"]}
          onToggle={toggleBanner}
          onEdit={editBanner}
          onDelete={deleteBanner}
        />
        <BannerSection
          title={bannerTypeLabels["slider-banner"]}
          items={grouped["slider-banner"]}
          onToggle={toggleBanner}
          onEdit={editBanner}
          onDelete={deleteBanner}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={scrollToCreate}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover"
          >
            <Icon name="send" className="h-4 w-4" />
            Create banner
          </button>
        </div>

        {showCreate ? (
          <section
            ref={createRef}
            id="create-banner"
            className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
                  Create Banner
                </p>
                <h2 className="mt-2 text-xl font-black text-main">
                  New banner entry
                </h2>
              </div>
              <Icon name="image" className="h-6 w-6 text-main/70" />
            </div>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Banner name" name="name" value={form.name} onChange={handleChange} placeholder="Holiday Pet Sale" />
              <Field
                label="Banner type"
                name="bannerType"
                value={form.bannerType}
                onChange={handleChange}
                as="select"
                options={[
                  ["hero-banner", "Hero banner"],
                  ["promo-banner", "Promo banner"],
                  ["slider-banner", "Slider banner"],
                ]}
              />
              <Field label="Slide order" name="slideNumber" value={form.slideNumber} onChange={handleChange} type="number" min="1" />

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover"
                >
                  <Icon name="check" className="h-4 w-4" />
                  Save banner
                </button>
              </div>
            </form>
          </section>
        ) : null}
      </div>
    </DashboardShell>
  );
}

function BannerSection({ title, items, onToggle, onDelete, onEdit }) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
      <div className="border-b border-neutral-100 px-5 py-4">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
          {title}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-mainSoft/30">
            <tr className="border-b border-neutral-100 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              <th className="px-4 py-3">Banner</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-center">State</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((banner) => (
              <tr key={banner.id} className="border-b border-neutral-100 last:border-b-0">
                <td className="px-4 py-4">
                  <p className="text-sm font-black text-main">{banner.name}</p>
                  <p className="mt-1 text-[11px] font-semibold text-slate-400">
                    {banner.id}
                  </p>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-black text-slate-700">
                    Slide {banner.slideNumber}
                  </p>
                </td>
                <td className="px-4 py-4 text-center">
                  <button type="button" onClick={() => onToggle(banner.id)} className="inline-flex">
                    <Badge tone={banner.isActive ? "green" : "gray"}>
                      {banner.isActive ? "Active" : "Hidden"}
                    </Badge>
                  </button>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-main/15 bg-mainSoft px-3 text-xs font-black text-main transition hover:bg-mainSoft/70"
                      onClick={() => onEdit(banner.name)}
                    >
                      <Icon name="edit" className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(banner.id, banner.name)}
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

function Metric({ title, value, note }) {
  return (
    <article className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-md shadow-main/5 ring-1 ring-main/15">
      <div className="mb-2 h-1.5 rounded-full bg-gradient-to-r from-main to-main/70" />
      <p className="text-sm font-extrabold text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-black text-main">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-400">{note}</p>
    </article>
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
