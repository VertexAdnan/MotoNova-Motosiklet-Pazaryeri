const quickLinks = [
  { label: "KVKK", href: "/kvkk-aydinlatma" },
  { label: "Gizlilik", href: "/gizlilik-politikasi" },
  { label: "Çerezler", href: "/cerez-politikasi" },
  { label: "Koşullar", href: "/kullanim-kosullari" },
];

const navLinks = [
  { label: "Ana Sayfa", href: "/" },
  { label: "İlanlar", href: "/ilanlar" },
  { label: "İlan Ver", href: "/ilan-ver" },
  { label: "Panelim", href: "/database" },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-slate-200/80 bg-white/75 backdrop-blur-md">
      <div className="footer-gradient-bar" />

      <div className="page-shell grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-secondary text-xs font-bold text-white">
              MN
            </span>
            <p className="text-lg font-extrabold text-slate-900">MotoNova</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500">
            Motosiklet alım satımını güvenle yap. Hızlı ilanlar, doğrulanmış satıcılar ve akıllı filtrelerle daha iyi deneyim.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Keşfet</p>
          <div className="mt-4 flex flex-col gap-2.5">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-slate-600 transition duration-300 hover:translate-x-1 hover:text-brand-primary"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Yasal</p>
          <div className="mt-4 flex flex-col gap-2.5">
            {quickLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-slate-600 transition duration-300 hover:translate-x-1 hover:text-brand-primary"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/60">
        <div className="page-shell flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MotoNova. Tüm hakları saklıdır.</p>
          <p className="badge-live font-medium text-slate-500">Canlı pazar yeri</p>
        </div>
      </div>
    </footer>
  );
}
