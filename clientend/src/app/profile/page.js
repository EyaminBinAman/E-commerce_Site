"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineCalendarDays,
  HiOutlineCheckBadge,
  HiOutlineCog6Tooth,
  HiOutlineEnvelope,
  HiOutlineExclamationTriangle,
  HiOutlineHeart,
  HiOutlineLockClosed,
  HiOutlineMapPin,
  HiOutlinePencil,
  HiOutlinePhone,
  HiOutlinePlus,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineSquares2X2,
  HiOutlineTrash,
  HiOutlineUser,
} from "react-icons/hi2";
import { PiPawPrintFill } from "react-icons/pi";

import ChangePasswordPopover from "@/components/ChangePasswordPopover";
import Container from "@/components/Container";
import DeleteAccountPopover from "@/components/DeleteAccountPopover";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL, apiRequest } from "@/lib/api";
import {
  formatBDT,
  getInitials,
  statusStyles,
} from "@/lib/profileMock";

const getImageUrl = (src) => {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return `${API_BASE_URL.replace("/api/v1", "")}${src}`;
};

const normalizeOrder = (order) => ({
  id: order.orderNumber || order._id,
  date: new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  status: order.orderStatus || "Pending",
  itemsCount: order.items?.reduce((total, item) => total + item.quantity, 0) || 0,
  total: order.grandTotal || 0,
  products: order.items?.map((item) => item.productName) || [],
});

const sections = [
  { id: "overview", label: "Overview", icon: HiOutlineSquares2X2 },
  { id: "personal", label: "Personal Info", icon: HiOutlineUser },
  { id: "addresses", label: "Addresses", icon: HiOutlineMapPin },
  { id: "orders", label: "My Orders", icon: HiOutlineShoppingBag },
  { id: "wishlist", label: "Wishlist", icon: HiOutlineHeart },
  { id: "settings", label: "Settings", icon: HiOutlineCog6Tooth },
];

const validTabs = new Set(sections.map((section) => section.id));

export default function ProfilePage() {
  const { user, logout, loaded, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab = searchParams.get("tab");
  const [active, setActive] = useState(
    initialTab && validTabs.has(initialTab) ? initialTab : "overview"
  );
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [pageMessage, setPageMessage] = useState("");

  useEffect(() => {
    if (loaded && !user) {
      router.replace("/");
    }
  }, [loaded, user, router]);

  const refreshProfileData = async () => {
    if (!user) return;

    setDataLoading(true);
    try {
      const [ordersData, wishlistData] = await Promise.all([
        apiRequest("/orders/my-orders").catch(() => ({ orders: [] })),
        apiRequest("/wishlist/get-wishlist").catch(() => ({
          wishlist: { items: [] },
        })),
      ]);

      setOrders((ordersData.orders || []).map(normalizeOrder));
      setWishlist(wishlistData.wishlist?.items || []);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    refreshProfileData();
  }, [user?.id]);

  if (!loaded) return <ProfileInlineSkeleton />;
  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <div className="bg-gradient-to-b from-mainSoft/60 via-white to-white py-10">
      <Container>
        <ProfileHeader user={user} onEdit={() => setActive("personal")} />

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <Sidebar
            active={active}
            onChange={setActive}
            onLogout={handleLogout}
          />

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            {active === "overview" && (
              <Overview
                user={user}
                orders={orders}
                wishlist={wishlist}
                isLoading={dataLoading}
                onNavigate={setActive}
              />
            )}
            {active === "personal" && (
              <PersonalInfo
                user={user}
                onUserUpdated={refreshUser}
                onMessage={setPageMessage}
              />
            )}
            {active === "addresses" && (
              <Addresses
                addresses={user.address || []}
                user={user}
                onUserUpdated={refreshUser}
                onMessage={setPageMessage}
              />
            )}
            {active === "orders" && (
              <Orders orders={orders} isLoading={dataLoading} />
            )}
            {active === "wishlist" && (
              <Wishlist
                items={wishlist}
                isLoading={dataLoading}
                onRefresh={refreshProfileData}
              />
            )}
            {active === "settings" && <Settings />}
            {pageMessage ? (
              <p className="mt-5 rounded-2xl bg-mainSoft px-4 py-3 text-sm font-semibold text-main">
                {pageMessage}
              </p>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
}

function ProfileInlineSkeleton() {
  return (
    <div className="bg-gradient-to-b from-mainSoft/60 via-white to-white py-10">
      <Container>
        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
            <Skeleton className="h-7 w-36 rounded-full" />
            <Skeleton className="h-7 w-36 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="space-y-2 rounded-3xl border border-neutral-200 bg-white p-3 shadow-sm">
            <Skeleton className="h-11 rounded-2xl" />
            <Skeleton className="h-11 rounded-2xl" />
            <Skeleton className="h-11 rounded-2xl" />
            <Skeleton className="h-11 rounded-2xl" />
            <Skeleton className="h-11 rounded-2xl" />
            <Skeleton className="h-11 rounded-2xl" />
          </div>
          <div className="space-y-5 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-80 max-w-full" />
            <div className="grid gap-4 sm:grid-cols-3">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        </div>
      </Container>
    </div>
  );
}

function ProfileHeader({ user, onEdit }) {
  const joined = new Date(user.joinedAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          {user.profilePic ? (
            <img
              src={getImageUrl(user.profilePic)}
              alt={user.fullName}
              className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-sm sm:h-18 sm:w-18"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent text-xl font-extrabold text-main shadow-sm sm:h-18 sm:w-18">
              {getInitials(user.fullName)}
            </div>
          )}

          <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">
                {user.fullName}
              </h1>
              <span className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                <HiOutlineCheckBadge className="text-sm" />
                Verified
              </span>
            </div>
            <p className="text-sm text-neutral-500">@{user.username}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="flex h-9 items-center gap-2 rounded-xl border border-main bg-white px-3.5 text-xs font-semibold text-main transition-colors duration-300 hover:bg-mainSoft"
        >
          <HiOutlinePencil className="text-sm" />
          Edit Profile
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-neutral-100 pt-4 text-xs sm:justify-start">
        <span className="flex items-center gap-1.5 rounded-full bg-mainSoft px-3 py-1.5 font-semibold text-main">
          <HiOutlineEnvelope className="text-sm" />
          {user.email}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-mainSoft px-3 py-1.5 font-semibold text-main">
          <HiOutlinePhone className="text-sm" />
          {user.phone}
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-mainSoft px-3 py-1.5 font-semibold text-main">
          <HiOutlineCalendarDays className="text-sm" />
          Joined {joined}
        </span>
      </div>
    </div>
  );
}

function Sidebar({ active, onChange, onLogout }) {
  return (
    <aside className="rounded-3xl border border-neutral-200 bg-white p-3 shadow-sm">
      <ul className="flex flex-col gap-1">
        {sections.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onChange(id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-main text-white shadow-sm"
                    : "text-neutral-700 hover:bg-mainSoft hover:text-main"
                }`}
              >
                <Icon className="text-lg" />
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-2 border-t border-neutral-100 pt-2">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-600 transition-all duration-300 hover:bg-red-50"
        >
          <HiOutlineArrowRightOnRectangle className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SectionHeading({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 pb-5">
      <div>
        <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-neutral-500">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function Overview({ user, orders, wishlist, isLoading, onNavigate }) {
  const stats = useMemo(
    () => [
      {
        label: "Total Orders",
        value: orders.length,
        icon: HiOutlineShoppingBag,
        tone: "main",
      },
      {
        label: "In Progress",
        value: orders.filter((order) =>
          ["Pending", "Confirmed", "Processing", "Shipped"].includes(
            order.status
          )
        ).length,
        icon: HiOutlineShoppingCart,
        tone: "accent",
      },
      {
        label: "Saved Items",
        value: wishlist.length,
        icon: HiOutlineHeart,
        tone: "main",
      },
    ],
    [orders, wishlist]
  );

  const recent = orders.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title={`Welcome back, ${user.fullName.split(" ")[0]}!`}
        description="Here's a quick overview of your PawTail activity."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-gradient-to-br from-white to-mainSoft/30 p-4"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                tone === "main"
                  ? "bg-mainSoft text-main"
                  : "bg-accent/15 text-accent"
              }`}
            >
              <Icon className="text-xl" />
            </span>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{value}</p>
              <p className="text-xs font-medium text-neutral-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900">
            Recent Orders
          </h3>
          <button
            type="button"
            onClick={() => onNavigate("orders")}
            className="text-xs font-semibold text-main transition-colors hover:text-mainHover"
          >
            View all
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {isLoading ? (
            <p className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
              Loading recent orders...
            </p>
          ) : recent.length ? (
            recent.map((order) => <OrderRow key={order.id} order={order} compact />)
          ) : (
            <p className="rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
              You have not placed any orders yet.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction
          icon={HiOutlinePencil}
          label="Edit Profile"
          onClick={() => onNavigate("personal")}
        />
        <QuickAction
          icon={HiOutlineMapPin}
          label="Manage Addresses"
          onClick={() => onNavigate("addresses")}
        />
        <QuickAction
          icon={HiOutlineShoppingBag}
          label="View Orders"
          onClick={() => onNavigate("orders")}
        />
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl border border-dashed border-neutral-200 px-4 py-3 text-sm font-semibold text-main transition-all duration-300 hover:border-main hover:bg-mainSoft"
    >
      <Icon className="text-lg" />
      {label}
    </button>
  );
}

function PersonalInfo({ user, onUserUpdated, onMessage }) {
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const data = new FormData(event.currentTarget);

    try {
      await apiRequest("/users/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: String(data.get("name") || "").trim(),
        }),
      });

      const nextPhone = String(data.get("phone") || "").trim();
      if (nextPhone && nextPhone !== (user.phone || "")) {
        await apiRequest("/users/request-update-otp", {
          method: "POST",
          body: JSON.stringify({ type: "phone" }),
        });
        setPendingPhone(nextPhone);
        onMessage("OTP sent to your email to confirm phone change");
      } else {
        await onUserUpdated();
        onMessage("Profile updated successfully");
      }
    } catch (error) {
      setError(error.message || "Could not update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhoneVerify = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await apiRequest("/users/update-phone", {
        method: "PATCH",
        body: JSON.stringify({
          phone: pendingPhone,
          code: phoneCode.trim(),
        }),
      });
      await onUserUpdated();
      setPendingPhone("");
      setPhoneCode("");
      onMessage("Phone number updated successfully");
    } catch (error) {
      setError(error.message || "Could not update phone.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile-image`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Could not upload image.");
      }
      await onUserUpdated();
      onMessage("Profile image updated successfully");
    } catch (error) {
      setError(error.message || "Could not upload image.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <SectionHeading
        title="Personal Information"
        description="Manage how your name, contact, and identity appear on PawTail."
        action={
          <button
            type="submit"
            disabled={isSaving}
            className="flex h-10 items-center gap-2 rounded-xl bg-main px-4 text-xs font-semibold text-white transition-colors duration-300 hover:bg-mainHover"
          >
            <HiOutlinePencil className="text-sm" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      <div className="flex flex-col items-start gap-5 rounded-2xl bg-mainSoft/40 p-5 sm:flex-row sm:items-center">
        {user.profilePic ? (
          <img
            src={getImageUrl(user.profilePic)}
            alt={user.fullName}
            className="h-20 w-20 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-xl font-extrabold text-main">
            {getInitials(user.fullName)}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-900">
            Profile photo
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            PNG or JPG, at least 200x200 pixels. Max 2MB.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-xl border border-main bg-white px-4 py-2 text-xs font-semibold text-main transition-colors hover:bg-mainSoft">
              {isUploading ? "Uploading..." : "Upload new"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" name="name" defaultValue={user.fullName} />
        <FormField label="Username" defaultValue={user.username} disabled />
        <FormField label="Email" type="email" defaultValue={user.email} disabled />
        <FormField label="Phone" name="phone" defaultValue={user.phone} />
        <FormField
          label="Joined"
          defaultValue={new Date(user.joinedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          disabled
        />
      </div>

      {pendingPhone ? (
        <div className="rounded-2xl border border-mainSoft bg-mainSoft/40 p-4">
          <p className="text-sm font-semibold text-main">
            Enter the OTP sent to your email to change phone to {pendingPhone}.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={phoneCode}
              onChange={(event) => setPhoneCode(event.target.value)}
              placeholder="6-digit OTP"
              className="h-11 flex-1 rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none focus:border-main"
            />
            <button
              type="button"
              onClick={handlePhoneVerify}
              disabled={isSaving}
              className="h-11 rounded-xl bg-main px-4 text-xs font-semibold text-white transition-colors hover:bg-mainHover"
            >
              {isSaving ? "Verifying..." : "Verify Phone"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPendingPhone("");
                setPhoneCode("");
              }}
              className="h-11 rounded-xl border border-neutral-200 px-4 text-xs font-semibold text-neutral-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}
    </form>
  );
}

function FormField({
  label,
  name,
  type = "text",
  defaultValue,
  disabled,
  onChange,
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-800">
        {label}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        disabled={disabled}
        className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none transition-colors duration-300 focus:border-main disabled:bg-neutral-50 disabled:text-neutral-500"
      />
    </div>
  );
}

const emptyAddress = {
  label: "Home",
  name: "",
  phone: "",
  line: "",
  area: "",
  city: "",
  postal: "",
  isDefault: false,
};

function Addresses({ addresses, user, onUserUpdated, onMessage }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const startAdd = () => {
    setError("");
    setEditing("new");
    setForm({
      ...emptyAddress,
      name: user.fullName,
      phone: user.phone || "",
      isDefault: !addresses.length,
    });
  };

  const startEdit = (address) => {
    setError("");
    setEditing(address.id);
    setForm({ ...emptyAddress, ...address });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const path =
        editing === "new" ? "/users/addresses" : `/users/addresses/${editing}`;
      const method = editing === "new" ? "POST" : "PATCH";

      await apiRequest(path, {
        method,
        body: JSON.stringify(form),
      });
      await onUserUpdated();
      setEditing(null);
      setForm(null);
      onMessage(
        editing === "new"
          ? "Address added successfully"
          : "Address updated successfully"
      );
    } catch (error) {
      setError(error.message || "Could not save address.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (addressId) => {
    await apiRequest(`/users/addresses/${addressId}`, { method: "DELETE" });
    await onUserUpdated();
    onMessage("Address deleted successfully");
  };

  const handleDefault = async (addressId) => {
    await apiRequest(`/users/addresses/${addressId}/default`, {
      method: "PATCH",
    });
    await onUserUpdated();
    onMessage("Default address updated");
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Saved Addresses"
        description="Choose where we should deliver your pet's treats."
        action={
          <button
            type="button"
            onClick={startAdd}
            className="flex h-10 items-center gap-2 rounded-xl bg-main px-4 text-xs font-semibold text-white transition-colors duration-300 hover:bg-mainHover"
          >
            <HiOutlinePlus className="text-sm" />
            Add new
          </button>
        }
      />

      {form ? (
        <form
          className="grid gap-4 rounded-2xl border border-mainSoft bg-mainSoft/30 p-5 sm:grid-cols-2"
          onSubmit={handleSave}
        >
          <FormField
            label="Label"
            name="label"
            defaultValue={form.label}
            onChange={(value) => setForm((current) => ({ ...current, label: value }))}
          />
          <FormField
            label="Receiver Name"
            name="name"
            defaultValue={form.name}
            onChange={(value) => setForm((current) => ({ ...current, name: value }))}
          />
          <FormField
            label="Phone"
            name="phone"
            defaultValue={form.phone}
            onChange={(value) => setForm((current) => ({ ...current, phone: value }))}
          />
          <FormField
            label="City"
            name="city"
            defaultValue={form.city}
            onChange={(value) => setForm((current) => ({ ...current, city: value }))}
          />
          <FormField
            label="Area"
            name="area"
            defaultValue={form.area}
            onChange={(value) => setForm((current) => ({ ...current, area: value }))}
          />
          <FormField
            label="Postal Code"
            name="postal"
            defaultValue={form.postal}
            onChange={(value) => setForm((current) => ({ ...current, postal: value }))}
          />
          <div className="sm:col-span-2">
            <FormField
              label="Address"
              name="line"
              defaultValue={form.line}
              onChange={(value) => setForm((current) => ({ ...current, line: value }))}
            />
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  isDefault: event.target.checked,
                }))
              }
            />
            Set as default address
          </label>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(null);
                setError("");
              }}
              className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-main px-4 py-2 text-xs font-semibold text-white"
            >
              {isSaving ? "Saving..." : "Save Address"}
            </button>
          </div>
          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 sm:col-span-2">
              {error}
            </p>
          ) : null}
        </form>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.length ? (
          addresses.map((address) => (
          <div
            key={address.id}
            className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-5 transition-all duration-300 hover:border-main"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-bold text-neutral-900">
                <HiOutlineMapPin className="text-base text-main" />
                {address.label}
              </span>
              {address.isDefault ? (
                <span className="rounded-full bg-mainSoft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-main">
                  Default
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDefault(address.id)}
                  className="text-[11px] font-semibold text-main transition-colors hover:text-mainHover"
                >
                  Set as default
                </button>
              )}
            </div>

            <div className="text-sm leading-6 text-neutral-700">
              <p className="font-semibold">{address.name}</p>
              <p>{address.phone}</p>
              <p className="mt-1 text-neutral-600">
                {address.line}, {address.area}
              </p>
              <p className="text-neutral-600">
                {address.city} - {address.postal}
              </p>
            </div>

            <div className="mt-1 flex gap-2 border-t border-neutral-100 pt-3">
              <button
                type="button"
                onClick={() => startEdit(address)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-main transition-colors hover:bg-mainSoft"
              >
                <HiOutlinePencil className="text-sm" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(address.id)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <HiOutlineTrash className="text-sm" />
                Delete
              </button>
            </div>
          </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-500 sm:col-span-2">
            No saved addresses yet.
          </p>
        )}
      </div>
    </div>
  );
}

const orderFilters = [
  "All",
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function Orders({ orders, isLoading }) {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        title="My Orders"
        description="Track everything from kibble to grooming kits."
      />

      <div className="flex flex-wrap gap-2">
        {orderFilters.map((option) => {
          const isActive = filter === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-main text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-mainSoft hover:text-main"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <p className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-500">
            Loading your orders...
          </p>
        ) : filtered.length ? (
          filtered.map((order) => <OrderRow key={order.id} order={order} />)
        ) : (
          <p className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-500">
            No orders in this status yet.
          </p>
        )}
      </div>
    </div>
  );
}

function OrderRow({ order, compact = false }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-4 transition-all duration-300 hover:border-main sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mainSoft text-main">
          <HiOutlineShoppingBag className="text-lg" />
        </span>
        <div>
          <p className="text-sm font-bold text-neutral-900">{order.id}</p>
          <p className="text-xs text-neutral-500">{order.date}</p>
          {!compact ? (
            <p className="mt-1 text-xs text-neutral-600">
              {order.products.slice(0, 2).join(", ")}
              {order.products.length > 2
                ? ` +${order.products.length - 2} more`
                : ""}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
            statusStyles[order.status] || "bg-neutral-100 text-neutral-700"
          }`}
        >
          {order.status}
        </span>
        <span className="text-xs font-medium text-neutral-500">
          {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
        </span>
        <span className="text-sm font-bold text-neutral-900">
          {formatBDT(order.total)}
        </span>
        <button
          type="button"
          className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-main transition-colors hover:border-main hover:bg-mainSoft"
        >
          View
        </button>
      </div>
    </div>
  );
}

function Wishlist({ items, isLoading, onRefresh }) {
  const [removingId, setRemovingId] = useState("");

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await apiRequest(`/wishlist/remove-wishlist-item/${productId}`, {
        method: "DELETE",
      });
      await onRefresh();
    } finally {
      setRemovingId("");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Wishlist"
        description="Pets you've spoiled later — these are your saved items."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {isLoading ? (
          <p className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-500 sm:col-span-2">
            Loading wishlist...
          </p>
        ) : items.length ? (
          items.map((item) => (
          <div
            key={item._id}
            className="flex gap-4 rounded-2xl border border-neutral-200 p-4 transition-all duration-300 hover:border-main"
          >
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-mainSoft">
              {item.image ? (
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <PiPawPrintFill className="text-4xl text-main" />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  {item.brand || "Saved item"}
                </span>
                <h3 className="mt-1 text-sm font-bold text-neutral-900">
                  {item.name}
                </h3>
                <p className="mt-1 text-base font-extrabold text-main">
                  {formatBDT(item.discountPrice || item.price)}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <a
                  href={`/product/${item.slug}`}
                  className="flex items-center gap-1.5 rounded-xl bg-main px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-300 hover:bg-mainHover disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  <HiOutlineShoppingCart className="text-sm" />
                  View product
                </a>
                <button
                  type="button"
                  onClick={() => handleRemove(item._id)}
                  disabled={removingId === item._id}
                  className="rounded-xl p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove from wishlist"
                >
                  <HiOutlineTrash className="text-base" />
                </button>
              </div>
            </div>
          </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center text-sm text-neutral-500 sm:col-span-2">
            Your wishlist is empty.
          </p>
        )}
      </div>
    </div>
  );
}

function Settings() {
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <SectionHeading
        title="Settings"
        description="Security and account preferences."
      />

      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mainSoft text-main">
            <HiOutlineLockClosed className="text-lg" />
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-neutral-900">
              Change Password
            </h3>
            <p className="mt-1 text-xs text-neutral-500">
              Update your password regularly. You&apos;ll need your current
              password and a one-time code to confirm the change.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsPasswordOpen(true)}
            className="h-9 shrink-0 rounded-xl border border-main bg-white px-3 text-xs font-semibold text-main transition-colors duration-300 hover:bg-mainSoft"
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-red-100 bg-red-50/40 p-5">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <HiOutlineExclamationTriangle className="text-lg" />
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-red-700">Danger zone</h3>
            <p className="mt-1 text-xs text-red-600/80">
              Deleting your account will remove your orders, addresses, and
              wishlist. We&apos;ll verify with an OTP before this is final.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsDeleteOpen(true)}
            className="h-9 shrink-0 rounded-xl border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition-colors duration-300 hover:bg-red-100"
          >
            Delete account
          </button>
        </div>
      </div>

      <ChangePasswordPopover
        open={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
      />
      <DeleteAccountPopover
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
}
