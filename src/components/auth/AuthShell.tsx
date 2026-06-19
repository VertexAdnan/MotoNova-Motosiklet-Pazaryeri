import { ReactNode } from "react";

const authHighlights = [
  "Güvenli oturum yönetimi",
  "KVKK uyumlu hesap akışı",
  "Bireysel ve kurumsal satıcı desteği",
];

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
  return (
    <div className="page-shell py-10 sm:py-14">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-stretch">
        <section className="surface-glass relative overflow-hidden rounded-2xl p-6 sm:p-7">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-400/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">{eyebrow}</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>

            <div className="mt-6 space-y-3">
              {authHighlights.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2.5 backdrop-blur-sm transition duration-300 hover:border-orange-200 hover:bg-white"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs text-orange-700">
                    ✓
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-panel rounded-2xl p-5 sm:p-6">
          {children}
          {footer ? <div className="mt-5 border-t border-slate-200 pt-4">{footer}</div> : null}
        </section>
      </div>
    </div>
  );
}
