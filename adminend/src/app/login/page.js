"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAdminAuth } from "@/components/AuthGate";
import { useToast } from "@/components/ui/toast";
import { loginAdmin } from "@/lib/adminApi";
import { saveAdminSession } from "@/lib/adminSession";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { setAdmin } = useAdminAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      showToast({ tone: "warning", title: "Enter email and password." });
      return;
    }

    setLoading(true);

    try {
      const data = await loginAdmin({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      setAdmin(data.user);

      if (form.remember) {
        saveAdminSession({
          name: data.user.name || "Admin",
          email: data.user.email,
          title: "Administrator",
          bio: "Signed in from the admin console.",
          status: "Active",
          lastLogin: new Date().toLocaleString("en-GB", {
            dateStyle: "long",
            timeStyle: "short",
          }),
          initials: (data.user.name || data.user.email || "AD")
            .split(/\s+/)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        });
      }

      showToast({ tone: "success", title: "Logged in." });
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      showToast({
        tone: "danger",
        title: "Login failed",
        description: error.message || "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-mainSoft/70 via-white to-white px-4 py-10 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-2xl shadow-main/5">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
              Admin Access
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-main md:text-4xl">
              Sign in to the dashboard
            </h1>
            <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-slate-500">
              Use the admin account to reach promo tools, content updates, review
              replies, and profile settings.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <InfoStat label="Promo codes" value="Live" />
              <InfoStat label="Banners" value="Live" />
              <InfoStat label="Reviews" value="Reply queue" />
              <InfoStat label="Profile" value="Editable" />
            </div>

            <div className="mt-8 rounded-[24px] border border-main/10 bg-mainSoft/30 p-5">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-main/70">
                Session
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                Login saves a local admin profile so the dashboard can keep track
                of your account details in this workspace.
              </p>
            </div>
          </section>

          <section className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-2xl shadow-main/5">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
              Login
            </p>
            <h2 className="mt-3 text-2xl font-black text-main">Welcome back</h2>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
              />
              <Field
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
              />

              <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-main focus:ring-main"
                />
                <span className="text-sm font-semibold text-slate-600">
                  Keep me signed in on this device
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between gap-3 text-sm font-semibold text-slate-500">
              <a href="/dashboard/profile" className="hover:text-main">
                Go to profile
              </a>
              <a href="/dashboard/promo-codes" className="hover:text-main">
                Open dashboard
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function InfoStat({ label, value }) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white px-4 py-4">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-main">{value}</p>
    </article>
  );
}

function Field({ label, name, type, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-main/75">
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1.5 h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-main"
      />
    </label>
  );
}
