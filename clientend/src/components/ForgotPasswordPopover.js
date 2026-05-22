"use client";

import { useEffect, useState } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineEnvelope,
  HiOutlineExclamationCircle,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineKey,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

import Modal from "@/components/ui/modal";
import { OtpInput } from "@/components/ui/otp-input";

const MOCK_OTP = "123456";

export default function ForgotPasswordPopover({ open, onClose, defaultEmail = "" }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep("email");
    setEmail(defaultEmail);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setShowNew(false);
    setShowConfirm(false);
  }, [open, defaultEmail]);

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setError("");
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setStep("otp");
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    setError("");
    if (otp.join("") !== MOCK_OTP) {
      setError("Incorrect OTP. (Hint: 123456 for testing.)");
      return;
    }
    setStep("reset");
  };

  const handleResetSubmit = (event) => {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const newPass = String(data.get("newPassword") || "");
    const confirm = String(data.get("confirmPassword") || "");

    if (newPass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPass !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setStep("success");
  };

  return (
    <Modal open={open} onClose={onClose} className="w-full max-w-md">
      <div className="p-6 sm:p-8">
        {step === "email" ? (
          <>
            <Header
              icon={HiOutlineKey}
              title="Forgot Password"
              description="Enter your account email and we'll send a verification code."
            />

            <form className="mt-5 flex flex-col gap-3" onSubmit={handleEmailSubmit}>
              <div>
                <label className="block text-xs font-semibold text-neutral-900">
                  Email
                </label>
                <div className="mt-1.5 flex w-full items-center rounded-xl border border-neutral-200 bg-white px-3 transition-colors duration-300 focus-within:border-main">
                  <HiOutlineEnvelope className="text-sm text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="ml-2 h-10 w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
                  />
                </div>
              </div>

              {error ? <ErrorPill text={error} /> : null}

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition-colors duration-300 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-main px-4 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-mainHover"
                >
                  Send OTP
                </button>
              </div>
            </form>
          </>
        ) : null}

        {step === "otp" ? (
          <>
            <Header
              icon={HiOutlineShieldCheck}
              title="Verify OTP"
              description={`Enter the 6-digit code sent to ${email}.`}
            />

            <form
              className="mt-5 flex flex-col items-center gap-4"
              onSubmit={handleOtpSubmit}
            >
              <OtpInput value={otp} onChange={setOtp} error={!!error} />
              {error ? <ErrorPill text={error} /> : null}

              <div className="mt-2 flex w-full items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setStep("email");
                  }}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition-colors duration-300 hover:bg-neutral-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-main px-4 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-mainHover"
                >
                  Verify
                </button>
              </div>
            </form>
          </>
        ) : null}

        {step === "reset" ? (
          <>
            <Header
              icon={HiOutlineLockClosed}
              title="Set New Password"
              description="Choose a strong password you haven't used before."
            />

            <form className="mt-5 flex flex-col gap-3" onSubmit={handleResetSubmit}>
              <PasswordField
                label="New Password"
                name="newPassword"
                placeholder="At least 6 characters"
                show={showNew}
                onToggle={() => setShowNew((value) => !value)}
              />
              <PasswordField
                label="Confirm New Password"
                name="confirmPassword"
                placeholder="Repeat new password"
                show={showConfirm}
                onToggle={() => setShowConfirm((value) => !value)}
              />

              {error ? <ErrorPill text={error} /> : null}

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition-colors duration-300 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-main px-4 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-mainHover"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </>
        ) : null}

        {step === "success" ? (
          <div className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mainSoft text-main">
              <HiOutlineCheckCircle className="text-3xl" />
            </span>
            <h2 className="mt-4 text-xl font-bold text-neutral-900">
              Password Reset
            </h2>
            <p className="mt-2 max-w-xs text-sm text-neutral-600">
              Your password has been reset. You can now log in with your new
              password.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-xl bg-main px-5 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-mainHover"
            >
              Back to Login
            </button>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

function Header({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mainSoft text-main">
        <Icon className="text-xl" />
      </span>
      <div>
        <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
        <p className="text-xs text-neutral-500">{description}</p>
      </div>
    </div>
  );
}

function PasswordField({ label, name, placeholder, show, onToggle }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-900">
        {label}
      </label>
      <div className="mt-1.5 flex w-full items-center rounded-xl border border-neutral-200 bg-white px-3 transition-colors duration-300 focus-within:border-main">
        <HiOutlineLockClosed className="text-sm text-neutral-400" />
        <input
          type={show ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          className="ml-2 h-10 w-full bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="ml-2 text-neutral-500 transition-colors duration-300 hover:text-neutral-800"
        >
          {show ? (
            <HiOutlineEyeSlash className="text-base" />
          ) : (
            <HiOutlineEye className="text-base" />
          )}
        </button>
      </div>
    </div>
  );
}

function ErrorPill({ text }) {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
      <HiOutlineExclamationCircle className="mt-0.5 text-base" />
      <span>{text}</span>
    </p>
  );
}
