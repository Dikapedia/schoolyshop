import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { AlertCircleIcon, ArrowRightIcon, CheckCircleIcon } from "@/components/icons";
import { passwordStrength } from "@/lib/auth/validation";

export function FormAlert({
  variant,
  children,
}: {
  variant: "error" | "success";
  children: ReactNode;
}) {
  const isError = variant === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      className={cx(
        "flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm",
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-800",
      )}
    >
      <span className="mt-0.5 shrink-0">
        {isError ? <AlertCircleIcon /> : <CheckCircleIcon />}
      </span>
      <p>{children}</p>
    </div>
  );
}

export function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <>
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
          Memproses…
        </>
      ) : (
        <>
          {children}
          <ArrowRightIcon width={16} height={16} />
        </>
      )}
    </button>
  );
}

export function PasswordStrength({ password }: { password: string }) {
  const strength = passwordStrength(password);
  if (!strength) return null;

  const color =
    strength.level === 1
      ? "bg-red-500"
      : strength.level === 2
        ? "bg-amber-500"
        : "bg-emerald-500";
  const text =
    strength.level === 1
      ? "text-red-600"
      : strength.level === 2
        ? "text-amber-600"
        : "text-emerald-600";

  return (
    <div className="mt-2 flex items-center justify-between gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cx(
              "h-1.5 flex-1 rounded-full",
              i <= strength.level ? color : "bg-slate-200",
            )}
          />
        ))}
      </div>
      <span className={cx("flex items-center gap-1 text-xs font-medium", text)}>
        {strength.level === 3 && <CheckCircleIcon width={14} height={14} />}
        {strength.label}
      </span>
    </div>
  );
}
