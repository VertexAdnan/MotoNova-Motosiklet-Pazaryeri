import { useEffect, useState } from "react";

const links = [
  { label: "Ana Sayfa", href: "/" },
  { label: "İlanlar", href: "/ilanlar" },
  { label: "İlan Ver", href: "/ilan-ver" },
  { label: "Güven", href: "/kullanim-kosullari" },
  { label: "Panelim", href: "/database" },
];

const legalPaths = [
  "/kullanim-kosullari",
  "/kvkk-aydinlatma",
  "/gizlilik-politikasi",
  "/cerez-politikasi",
];

type SessionUser = {
  username?: string;
  fullName?: string;
} | null;

function isLinkActive(href: string, pathname: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/ilanlar") {
    return pathname === "/ilanlar" || pathname.startsWith("/ilan-detay");
  }

  if (href === "/kullanim-kosullari") {
    return legalPaths.includes(pathname);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function IconLogin() {
  return (
    <svg className="nav-btn-icon" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M6.75 3.75h6a1.5 1.5 0 0 1 1.5 1.5v8.25a1.5 1.5 0 0 1-1.5 1.5h-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3.75 9h7.5M7.5 6.75 10.5 9 7.5 11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUserPlus() {
  return (
    <svg className="nav-btn-icon" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="5.25" r="2.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.25 14.25c0-2.485 2.015-4.5 4.5-4.5h1.5c2.485 0 4.5 2.015 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M14.25 6.75v4.5M12 9h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg className="nav-btn-icon" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M6.75 3.75h6a1.5 1.5 0 0 1 1.5 1.5v8.25a1.5 1.5 0 0 1-1.5 1.5h-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10.5 9H2.25M5.25 6.75 2.25 9l3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getInitials(name?: string) {
  if (!name) return "MN";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const [sessionUser, setSessionUser] = useState<SessionUser>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    fetch("/api/auth/session-info", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data?.hasSession) {
          setSessionUser(data.session?.data || null);
        }
      })
      .catch(() => {
        setSessionUser(null);
      });
  }, []);

  useEffect(() => {
    const syncPath = () => {
      setCurrentPath(window.location.pathname);
    };

    syncPath();
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/";
  };

  const displayName = sessionUser?.fullName || sessionUser?.username || "Kullanıcı";

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-400 ${
          isScrolled
            ? "navbar-scrolled border-slate-200/80 bg-white/85 backdrop-blur-xl"
            : "border-transparent bg-white/70 backdrop-blur-md"
        }`}
      >
        <div className="page-shell flex h-18 items-center justify-between gap-6 py-3">
          <a href="/" className="group inline-flex items-center gap-2.5">
            <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-brand-secondary text-sm font-bold text-white shadow-soft transition-transform duration-300 group-hover:scale-105 group-hover:shadow-glow-orange">
              <span className="relative z-10">MN</span>
              <span className="absolute inset-0 bg-linear-to-br from-brand-primary/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            <span className="text-base font-extrabold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-brand-primary sm:text-lg">
              MotoNova
            </span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const isActive = isLinkActive(link.href, currentPath);

              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`nav-link ${isActive ? "is-active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            {sessionUser ? (
              <>
                <div className="nav-user-badge">
                  <span className="nav-user-avatar">{getInitials(displayName)}</span>
                  <span className="nav-user-name">Merhaba, {displayName}</span>
                </div>
                <button type="button" onClick={handleLogout} className="nav-btn nav-btn-logout">
                  <IconLogout />
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <a href="/giris" className="nav-btn nav-btn-ghost">
                  <IconLogin />
                  Giriş Yap
                </a>
                <a href="/kayit-ol" className="nav-btn nav-btn-primary">
                  <IconUserPlus />
                  Kayıt Ol
                </a>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label="Menüyü aç"
            onClick={() => setIsMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-700 transition hover:border-orange-200 hover:text-orange-700 lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${isMobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition duration-400 ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMobileOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-[85%] max-w-xs flex-col bg-white p-5 shadow-2xl transition duration-500 ${
            isMobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="text-lg font-extrabold text-slate-900">MotoNova</span>
            <button
              type="button"
              aria-label="Menüyü kapat"
              onClick={() => setIsMobileOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const isActive = isLinkActive(link.href, currentPath);

              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`nav-link-mobile ${isActive ? "is-active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-2.5 pt-6">
            {sessionUser ? (
              <>
                <div className="nav-user-badge inline-flex w-full">
                  <span className="nav-user-avatar">{getInitials(displayName)}</span>
                  <span className="nav-user-name max-w-none">{displayName}</span>
                </div>
                <button type="button" onClick={handleLogout} className="nav-btn nav-btn-logout w-full">
                  <IconLogout />
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <a href="/giris" onClick={() => setIsMobileOpen(false)} className="nav-btn nav-btn-ghost w-full">
                  <IconLogin />
                  Giriş Yap
                </a>
                <a href="/kayit-ol" onClick={() => setIsMobileOpen(false)} className="nav-btn nav-btn-primary w-full">
                  <IconUserPlus />
                  Kayıt Ol
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
