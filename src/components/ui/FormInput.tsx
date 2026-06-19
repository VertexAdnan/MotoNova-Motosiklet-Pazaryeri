import { InputHTMLAttributes } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export default function FormInput({ label, hint, error, className = "", id, ...props }: FormInputProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="search-label">{label}</span>
      <input id={id} className={`input-base ${className}`} {...props} />
      {hint && !error && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
