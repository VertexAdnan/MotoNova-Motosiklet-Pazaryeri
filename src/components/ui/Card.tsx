import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <article
      className={`group rounded-card border border-brand-border bg-white/95 shadow-soft backdrop-blur-sm transition-all duration-400 hover:-translate-y-1 hover:border-orange-200/60 hover:shadow-card ${className}`}
    >
      {children}
    </article>
  );
}
