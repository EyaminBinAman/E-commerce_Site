"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import {
  bannerTypeLabels,
  bannerTypeOptions,
  buildBannerFormData,
  createBannerOnApi,
  deleteBannerOnApi,
  getBannerImageUrl,
  getBannersFromApi,
  toggleBannerActiveOnApi,
  updateBannerOnApi,
} from "@/lib/bannerApi";

const initialForm = {
  name: "",
  bannerType: "hero-banner",
  slideNumber: "1",
  linkUrl: "",
  altText: "",
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
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const createRef = useRef(null);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const rows = await getBannersFromApi();
      setBanners(rows);
    } catch (error) {
      showToast({
        tone: "danger",
        title: error.message || "Failed to load banners.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const grouped = useMemo(() => groupByType(banners), [banners]);
  const summary = useMemo(
    () => ({
      active: banners.filter((banner) => banner.isActive).length,
      total: banners.length,
    }),
    [banners]
  );

  const resetForm = () => {
    setForm(initialForm);
    setImageFile(null);
    setEditingId("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToCreate = () => {
    setShowCreate(true);
    resetForm();
  };

  const startEdit = (banner) => {
    setShowCreate(true);
    setEditingId(banner._id);
    setForm({
      name: banner.name || "",
      bannerType: banner.bannerType,
      slideNumber: String(banner.slideNumber || 1),
      linkUrl: banner.linkUrl || "",
      altText: banner.altText || "",
    });
    setImageFile(null);
    setImagePreview(getBannerImageUrl(banner.imageUrl));
    createRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      showToast({ tone: "warning", title: "Banner name is required." });
      return;
    }

    if (!editingId && !imageFile) {
      showToast({ tone: "warning", title: "Banner image is required." });
      return;
    }

    setSaving(true);
    try {
      const payload = buildBannerFormData({
        name: form.name,
        bannerType: form.bannerType,
        slideNumber: Number(form.slideNumber) || 1,
        linkUrl: form.linkUrl,
        altText: form.altText,
        imageFile,
      });

      if (editingId) {
        await updateBannerOnApi(editingId, payload);
        showToast({ tone: "success", title: "Banner updated." });
      } else {
        await createBannerOnApi(payload);
        showToast({ tone: "success", title: "Banner created." });
      }

      resetForm();
      setShowCreate(false);
      await loadBanners();
    } catch (error) {
      showToast({
        tone: "danger",
        title: error.message || "Could not save banner.",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleBanner = async (banner) => {
    try {
      const updated = await toggleBannerActiveOnApi(banner._id, !banner.isActive);
      setBanners((current) =>
        current.map((row) => (row._id === updated._id ? updated : row))
      );
      showToast({
        tone: "success",
        title: updated.isActive ? "Banner activated." : "Banner hidden.",
      });
    } catch (error) {
      showToast({
        tone: "danger",
        title: error.message || "Could not update banner status.",
      });
    }
  };

  const deleteBanner = (banner) => {
    confirm({
      title: `Delete ${banner.name}?`,
      description: "This banner and its image will be removed.",
      confirmLabel: "Delete",
      tone: "danger",
      onConfirm: async () => {
        try {
          await deleteBannerOnApi(banner._id);
          setBanners((current) => current.filter((row) => row._id !== banner._id));
          if (editingId === banner._id) {
            resetForm();
          }
          showToast({ tone: "success", title: "Banner deleted." });
        } catch (error) {
          showToast({
            tone: "danger",
            title: error.message || "Could not delete banner.",
          });
        }
      },
    });
  };

  return (
    <DashboardShell activeItem="Promo Banners">
      <div
        ref={createRef}
        className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
              Marketing
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
              Promo Banners
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
              Upload banner images here. Active hero banners appear on the home carousel;
              promo banners appear in the deals section.
            </p>
          </div>
          {!showCreate ? (
            <button
              type="button"
              onClick={scrollToCreate}
              className="inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover"
            >
              <Icon name="send" className="h-4 w-4" />
              Create banner
            </button>
          ) : null}
        </div>

        {showCreate ? (
          <section id="create-banner" className="mt-6 border-t border-neutral-100 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
                  {editingId ? "Edit Banner" : "Create Banner"}
                </p>
                <h2 className="mt-2 text-xl font-black text-main">
                  {editingId ? "Update banner entry" : "New banner entry"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  resetForm();
                }}
                className="inline-flex h-9 items-center rounded-xl border border-neutral-200 px-3 text-xs font-black text-slate-500 transition hover:bg-mainSoft hover:text-main"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="Banner name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Holiday Pet Sale"
              />
              <Field
                label="Banner type"
                name="bannerType"
                value={form.bannerType}
                onChange={handleChange}
                as="select"
                options={bannerTypeOptions}
              />
              <Field
                label="Slide order"
                name="slideNumber"
                value={form.slideNumber}
                onChange={handleChange}
                type="number"
                min="1"
              />
              <Field
                label="Link URL (optional)"
                name="linkUrl"
                value={form.linkUrl}
                onChange={handleChange}
                placeholder="/categories/dog"
              />
              <Field
                label="Alt text (optional)"
                name="altText"
                value={form.altText}
                onChange={handleChange}
                placeholder="Summer pet essentials banner"
                className="sm:col-span-2"
              />

              <div className="sm:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-main/75">
                  Banner image {editingId ? "(optional on update)" : ""}
                </span>
                <div className="mt-1.5 flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setImageFile(event.target.files?.[0] || null)
                    }
                    className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-mainSoft file:px-3 file:py-2 file:text-sm file:font-black file:text-main"
                  />
                  {imagePreview ? (
                    <div className="relative h-24 w-40 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                      <Image
                        src={imagePreview}
                        alt="Banner preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex justify-end gap-2 sm:col-span-2">
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex h-11 items-center rounded-xl border border-neutral-200 px-4 text-sm font-black text-main transition hover:bg-mainSoft"
                  >
                    Cancel edit
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  <Icon name="check" className="h-4 w-4" />
                  {saving ? "Saving..." : editingId ? "Update banner" : "Save banner"}
                </button>
              </div>
            </form>
          </section>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Metric
          title="Active banners"
          value={summary.active}
          note="Currently visible on the storefront."
        />
        <Metric
          title="Total banners"
          value={summary.total}
          note="All saved banners in the system."
        />
      </div>

      <div className="mt-5 space-y-5">
        <BannerSection
          title={bannerTypeLabels["hero-banner"]}
          items={grouped["hero-banner"]}
          loading={loading}
          onToggle={toggleBanner}
          onEdit={startEdit}
          onDelete={deleteBanner}
        />
        <BannerSection
          title={bannerTypeLabels["promo-banner"]}
          items={grouped["promo-banner"]}
          loading={loading}
          onToggle={toggleBanner}
          onEdit={startEdit}
          onDelete={deleteBanner}
        />
        <BannerSection
          title={bannerTypeLabels["slider-banner"]}
          items={grouped["slider-banner"]}
          loading={loading}
          onToggle={toggleBanner}
          onEdit={startEdit}
          onDelete={deleteBanner}
        />
      </div>
    </DashboardShell>
  );
}

function BannerSection({ title, items, loading, onToggle, onDelete, onEdit }) {
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
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Banner</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-center">State</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                  Loading banners...
                </td>
              </tr>
            ) : null}
            {!loading &&
              items.map((banner) => (
                <tr key={banner._id} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-4 py-4">
                    <div className="relative h-14 w-24 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
                      <Image
                        src={getBannerImageUrl(banner.imageUrl)}
                        alt={banner.altText || banner.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-black text-main">{banner.name}</p>
                    {banner.linkUrl ? (
                      <p className="mt-1 text-[11px] font-semibold text-slate-400">
                        {banner.linkUrl}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-black text-slate-700">
                      Slide {banner.slideNumber}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggle(banner)}
                      className="inline-flex"
                    >
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
                        onClick={() => onEdit(banner)}
                      >
                        <Icon name="edit" className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(banner)}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-black text-red-600 transition hover:bg-red-100"
                      >
                        <Icon name="trash" className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!loading && items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                  No banners in this group yet.
                </td>
              </tr>
            ) : null}
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
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
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
