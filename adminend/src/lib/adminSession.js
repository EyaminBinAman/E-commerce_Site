export const ADMIN_SESSION_KEY = "adminflow-admin-session";

export const DEFAULT_ADMIN_PROFILE = {
  name: "Eyamin Aman",
  email: "eyamin.aman@adminflow.local",
  phone: "+880 1700 000000",
  role: "Administrator",
  title: "Store Operations Lead",
  bio: "Handles catalog operations, promo campaigns, customer replies, and internal admin workflows.",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  status: "Active",
  initials: "EA",
  lastLogin: "June 12, 2026 09:40",
};

function canUseStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadAdminSession() {
  if (!canUseStorage()) {
    return DEFAULT_ADMIN_PROFILE;
  }

  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) {
      return DEFAULT_ADMIN_PROFILE;
    }

    return { ...DEFAULT_ADMIN_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ADMIN_PROFILE;
  }
}

export function saveAdminSession(session) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({ ...DEFAULT_ADMIN_PROFILE, ...session })
  );
}

export function clearAdminSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}
