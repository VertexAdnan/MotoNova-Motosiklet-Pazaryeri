import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-white shadow-soft hover:bg-brand-primary-deep hover:shadow-glow-orange hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-orange-200 btn-shine",
  secondary:
    "bg-brand-secondary text-white shadow-soft hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-slate-300",
  outline:
    "border border-slate-300 bg-white/90 text-slate-700 backdrop-blur-sm hover:border-orange-300 hover:text-orange-700 hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0 active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-orange-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
