"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "pawtail.user";

const MOCK_USER = {
  id: "u_test_001",
  fullName: "Test Pet Parent",
  username: "petparent",
  email: "test@ahp.com",
  phone: "+880 1712-345678",
  gender: "Prefer not to say",
  dateOfBirth: "1995-04-12",
  joinedAt: "2025-08-12",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore storage errors (private mode, etc.)
    }
    setLoaded(true);
  }, []);

  const login = useCallback((email, password) => {
    const isValid = email === "test@ahp.com" && password === "test101";
    if (!isValid) {
      return {
        ok: false,
        error: "Invalid email or password. Try test@ahp.com / test101.",
      };
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USER));
    } catch {
      // ignore
    }
    setUser(MOCK_USER);
    return { ok: true, user: MOCK_USER };
  }, []);

  const logout = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, loaded }),
    [user, login, logout, loaded]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
