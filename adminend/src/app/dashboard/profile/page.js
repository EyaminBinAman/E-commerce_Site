"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardShell, { Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import {
  clearAdminSession,
  DEFAULT_ADMIN_PROFILE,
  loadAdminSession,
  saveAdminSession,
} from "@/lib/adminSession";

const initialSecurity = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(() => loadAdminSession());
  const [security, setSecurity] = useState(initialSecurity);

  const initials = useMemo(() => {
    const parts = String(profile.name || "").trim().split(/\s+/);
    const first = parts[0]?.[0] || "A";
    const second = parts[1]?.[0] || profile.email?.[0] || "D";
    return `${first}${second}`.toUpperCase();
  }, [profile]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (event) => {
    const { name, value } = event.target;
    setSecurity((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    const next = { ...profile, initials };
    setProfile(next);
    saveAdminSession(next);
    showToast({ tone: "success", title: "Profile saved." });
  };

  const resetProfile = () => {
    setProfile(DEFAULT_ADMIN_PROFILE);
    saveAdminSession(DEFAULT_ADMIN_PROFILE);
    showToast({ tone: "info", title: "Profile reset to defaults." });
  };

  const changePassword = () => {
    if (!security.currentPassword || !security.newPassword) {
      showToast({ tone: "warning", title: "Fill in the password fields first." });
      return;
    }

    if (security.newPassword !== security.confirmPassword) {
      showToast({ tone: "danger", title: "New passwords do not match." });
      return;
    }

    setSecurity(initialSecurity);
    showToast({ tone: "success", title: "Password updated in this demo profile." });
  };

  const signOut = () => {
    clearAdminSession();
    showToast({ tone: "success", title: "Signed out." });
    router.push("/login");
  };

  return (
    <DashboardShell activeItem="My Profile">
      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
          Account
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
          My Profile
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          Update your admin identity, working details, and local session data.
        </p>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-main to-accent text-2xl font-black text-white shadow-lg shadow-main/20">
              {initials}
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
                Active profile
              </p>
              <h2 className="mt-2 text-2xl font-black text-main">{profile.name}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">{profile.title}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <ProfileChip label="Email" value={profile.email} />
            <ProfileChip label="Phone" value={profile.phone} />
            <ProfileChip label="Role" value={profile.role} />
            <ProfileChip label="Location" value={profile.location} />
            <ProfileChip label="Timezone" value={profile.timezone} />
            <ProfileChip label="Status" value={profile.status} />
          </div>

          <div className="mt-5 rounded-2xl border border-neutral-200 bg-mainSoft/30 p-4">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-main/70">
              Bio
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              {profile.bio}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={saveProfile}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover"
            >
              <Icon name="check" className="h-4 w-4" />
              Save profile
            </button>
            <button
              type="button"
              onClick={resetProfile}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-black text-slate-600 transition hover:bg-neutral-50"
            >
              Reset
            </button>
          </div>
        </aside>

        <div className="space-y-5">
          <section className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
                  Personal details
                </p>
                <h2 className="mt-2 text-xl font-black text-main">
                  Edit profile information
                </h2>
              </div>
              <Icon name="user" className="h-6 w-6 text-main/70" />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" value={profile.name} onChange={handleProfileChange} />
              <Field label="Email" name="email" value={profile.email} onChange={handleProfileChange} type="email" />
              <Field label="Phone" name="phone" value={profile.phone} onChange={handleProfileChange} />
              <Field label="Title" name="title" value={profile.title} onChange={handleProfileChange} />
              <Field label="Location" name="location" value={profile.location} onChange={handleProfileChange} />
              <Field label="Timezone" name="timezone" value={profile.timezone} onChange={handleProfileChange} />
              <Field label="Status" name="status" value={profile.status} onChange={handleProfileChange} />
              <div className="sm:col-span-2">
                <label className="block">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-main/75">
                    Bio
                  </span>
                  <textarea
                    name="bio"
                    rows={5}
                    value={profile.bio}
                    onChange={handleProfileChange}
                    className="mt-1.5 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-main"
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
                  Security
                </p>
                <h2 className="mt-2 text-xl font-black text-main">
                  Change password
                </h2>
              </div>
              <Icon name="lock" className="h-6 w-6 text-main/70" />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Field
                label="Current password"
                name="currentPassword"
                value={security.currentPassword}
                onChange={handleSecurityChange}
                type="password"
              />
              <Field
                label="New password"
                name="newPassword"
                value={security.newPassword}
                onChange={handleSecurityChange}
                type="password"
              />
              <Field
                label="Confirm password"
                name="confirmPassword"
                value={security.confirmPassword}
                onChange={handleSecurityChange}
                type="password"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={changePassword}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover"
              >
                <Icon name="send" className="h-4 w-4" />
                Update password
              </button>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-black text-red-600 transition hover:bg-red-100"
              >
                <Icon name="log-in" className="h-4 w-4 rotate-180" />
                Sign out
              </button>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}

function ProfileChip({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
        {label}
      </p>
      <p className="text-sm font-black text-main">{value}</p>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-main/75">
        {label}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className="mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-main"
      />
    </label>
  );
}
