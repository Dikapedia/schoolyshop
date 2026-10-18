"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { EyeIcon, EyeOffIcon, LockIcon } from "@/components/icons";

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
  label: string;
  icon: ReactNode;
  error?: string;
  /** Teks kecil di depan input, misalnya "+62". */
  prefix?: ReactNode;
  /** Elemen di ujung kanan input, misalnya tombol lihat sandi. */
  trailing?: ReactNode;
  /** Konten tambahan di bawah input, misalnya indikator kekuatan sandi. */
  hint?: ReactNode;
};

export function Field({
  label,
  icon,
  error,
  prefix,
  trailing,
  hint,
  id,
  className,
  ...inputProps
}: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>
      <div
        className={cx(
          "flex h-11 items-center gap-2.5 rounded-lg border bg-white px-3 shadow-sm transition focus-within:ring-4",
          error
            ? "border-red-500 focus-within:ring-red-500/10"
            : "border-slate-200 focus-within:border-blue-600 focus-within:ring-blue-600/10",
          className,
        )}
      >
        <span className="shrink-0 text-slate-400">{icon}</span>
        {prefix && (
          <span className="shrink-0 border-r border-slate-200 pr-2.5 text-sm text-slate-700">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          {...inputProps}
        />
        {trailing}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
      {hint}
    </div>
  );
}

type PasswordFieldProps = Omit<FieldProps, "icon" | "trailing" | "type">;

export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Field
      {...props}
      icon={<LockIcon />}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          aria-pressed={visible}
          className="shrink-0 rounded p-1 text-slate-400 transition hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
    />
  );
}
