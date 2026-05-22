"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineExclamationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

import Modal from "@/components/ui/modal";
import { OtpInput } from "@/components/ui/otp-input";
import { useAuth } from "@/context/AuthContext";

const MOCK_OTP = "123456";

export default function DeleteAccountPopover({ open, onClose }) {
  const { logout } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState("otp");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setStep("otp");
    setOtp(["", "", "", "", "", ""]);
    setError("");
  }, [open]);

  const handleOtpVerify = (event) => {
    event.preventDefault();
    setError("");
    if (otp.join("") !== MOCK_OTP) {
      setError("Incorrect OTP. (Hint: 123456 for testing.)");
      return;
    }
    setStep("confirm");
  };

  const handleDelete = () => {
    logout();
    onClose?.();
    router.replace("/");
  };

  return (
    <Modal open={open} onClose={onClose} className="w-full max-w-md">
      <div className="p-6 sm:p-8">
        {step === "otp" ? (
          <>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <HiOutlineShieldCheck className="text-xl" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  Verify OTP
                </h2>
                <p className="text-xs text-neutral-500">
                  We sent a 6-digit code to confirm it&apos;s really you.
                </p>
              </div>
            </div>

            <form
              className="mt-5 flex flex-col items-center gap-4"
              onSubmit={handleOtpVerify}
            >
              <OtpInput value={otp} onChange={setOtp} error={!!error} />
              {error ? <ErrorPill text={error} /> : null}

              <div className="mt-2 flex w-full items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition-colors duration-300 hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-red-700"
                >
                  Verify
                </button>
              </div>
            </form>
          </>
        ) : null}

        {step === "confirm" ? (
          <>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <HiOutlineExclamationTriangle className="text-xl" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  Are you sure?
                </h2>
                <p className="text-xs text-neutral-500">
                  This will permanently delete your PawTail account.
                </p>
              </div>
            </div>

            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm leading-6 text-red-700">
              All your orders, addresses, and saved items will be removed.{" "}
              <span className="font-bold">This cannot be undone.</span>
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-700 transition-colors duration-300 hover:bg-neutral-50"
              >
                No, keep account
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-300 hover:bg-red-700"
              >
                Yes, delete
              </button>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
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
