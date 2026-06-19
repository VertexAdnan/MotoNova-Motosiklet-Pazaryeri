import { useEffect, useState } from "react";
import ListingCard from "../components/marketplace/ListingCard";
import SearchBar from "../components/marketplace/SearchBar";
import Button from "../components/ui/Button";
import RevealOnScroll from "../components/ui/RevealOnScroll";
import { legalHighlightsTR } from "../config/legal";

export const title = "MotoNova | Motosiklet Pazaryeri";
export const description = "Akıllı filtrelerle hayalindeki motosikleti bul, güvenli ve hızlı şekilde iletişime geç.";

const categories = [
  { label: "Spor", icon: "⚡" },
  { label: "Naked", icon: "🔥" },
  { label: "Cruiser", icon: "🛣" },
  { label: "Touring", icon: "🧭" },
  { label: "Scooter", icon: "🏙" },
];

const legalLinks = [
  { label: "KVKK Aydınlatma", href: "/kvkk-aydinlatma" },
  { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
  { label: "Çerez Politikası", href: "/cerez-politikasi" },
  { label: "Kullanım Koşulları", href: "/kullanim-kosullari" },
];

type FeaturedListing = {
  id: string;
  title: string;
  price: string;
  city: string;
  year: number;
  engineCc: number;
  imageUrl: string;
  featured?: boolean;
};

export default function Index() {
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([]);
  const [totalListings, setTotalListings] = useState(0);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch("/api/listings?featured=true&limit=4")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          return;
        }

        setFeaturedListings(data.listings || []);
        setTotalListings(data.total || 0);
      })
      .catch(() => {
        setFeaturedListings([]);
        setTotalListings(0);
      });
  }, []);

  const inventoryLabel = totalListings > 0 ? `${totalListings.toLocaleString("tr-TR")} İlan` : "Canlı envanter";

  return (
    <div>
      <section className="page-shell relative overflow-hidden py-12 sm:py-14 lg:py-20">
        <div
          className="hero-glow-orb -left-20 top-0 h-72 w-72 bg-orange-400/20"
          aria-hidden="true"
        />
        <div
          className="hero-glow-orb -right-16 top-20 h-64 w-64 bg-cyan-400/15"
          aria-hidden="true"
        />

        <div className="hero-grid relative">
          <div className={`transition-all duration-700 ${heroReady ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
            <p className="badge-live inline-flex rounded-full border border-orange-200/80 bg-orange-50/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-orange-700 backdrop-blur-sm">
              Motosiklet tutkunları için tasarlandı
            </p>

            <h1 className="mt-6 text-4xl font-black leading-[1.08] sm:text-5xl lg:text-6xl">
              <span className="text-gradient-hero">Hayalindeki motoru</span>
              <br />
              <span className="text-slate-900">MotoNova&apos;da bul.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Binlerce doğrulanmış ilanı keşfet, fiyatları karşılaştır ve satıcılarla anında iletişime geç.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="/ilanlar">
                <Button variant="primary" size="lg">
                  İlanları Keşfet
                </Button>
              </a>
              <a href="/ilan-ver">
                <Button variant="outline" size="lg">
                  İlan Ver
                </Button>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6">
              {[
                { value: "500+", label: "Aktif ilan" },
                { value: "81", label: "İl kapsamı" },
                { value: "7/24", label: "Canlı arama" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`transition-all duration-700 ${heroReady ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative transition-all duration-700 delay-200 ${heroReady ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <div className="hero-image-frame border border-white/60 bg-white/40 p-3 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1515777315835-281b94c9589f?auto=format&fit=crop&w=1200&q=80"
                alt="Kahraman motosiklet görseli"
                className="relative z-0 h-[300px] w-full rounded-xl object-cover sm:h-[380px]"
              />
            </div>
            <div className="hero-stat-badge absolute -bottom-5 -left-4 rounded-2xl border border-white/70 bg-white/90 px-5 py-3.5 shadow-card backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Canlı envanter</p>
              <p className="mt-1 text-xl font-extrabold text-gradient-brand">{inventoryLabel}</p>
            </div>
          </div>
        </div>
      </section>

      <RevealOnScroll className="page-shell pb-12 sm:pb-16">
        <SearchBar />
      </RevealOnScroll>

      <RevealOnScroll className="page-shell pb-12 sm:pb-16" delay={80}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="section-title">Kategoriler</h2>
            <p className="section-subtitle">Sürüş tarzına ve kullanım amacına göre ilanları keşfet.</p>
          </div>
          <a
            href="/ilanlar"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-orange-700 transition hover:text-orange-800"
          >
            Tüm kategoriler
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => (
            <a key={category.label} href="/ilanlar" className="category-chip">
              <span aria-hidden="true">{category.icon}</span>
              {category.label}
            </a>
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll className="page-shell pb-12 sm:pb-16 lg:pb-18" delay={120}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="section-title">Öne çıkan motosikletler</h2>
            <p className="section-subtitle">Eksiksiz teknik bilgiler ve şeffaf fiyatlarla özenle seçilmiş ilanlar.</p>
          </div>
          <a href="/ilanlar">
            <Button variant="secondary">Tüm ilanları gör</Button>
          </a>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredListings.length > 0 ? (
            featuredListings.map((listing, index) => (
              <div
                key={listing.id}
                className={`reveal-up ${heroReady ? "in-view" : ""} stagger-${Math.min(index + 1, 5)}`}
              >
                <ListingCard
                  id={listing.id}
                  {...listing}
                  detailHref={`/ilan-detay?ilan=${listing.id}`}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full surface-panel rounded-2xl p-8 text-center">
              <p className="text-lg font-bold text-slate-900">Henüz öne çıkan ilan yok</p>
              <p className="mt-2 text-sm text-slate-600">İlk ilanı sen vererek pazaryeri envanterini başlatabilirsin.</p>
              <div className="mt-4">
                <a href="/ilan-ver">
                  <Button>İlan Ver</Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </RevealOnScroll>

      <RevealOnScroll className="page-shell pb-16 sm:pb-22" delay={160}>
        <div className="surface-glass relative overflow-hidden rounded-2xl p-6 sm:p-7">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-cyan-500/5" />

          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">Güven ve Şeffaflık</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                Yasal bilgilere arayüz içinden hızlı erişim
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                MotoNova&apos;da KVKK, gizlilik, çerez tercihleri ve kullanım koşulları her zaman görünür ve erişilebilir durumda tutulur.
              </p>
            </div>
            <a href="/ilan-ver">
              <Button variant="outline">Yasal uyumlu ilan ver</Button>
            </a>
          </div>

          <div className="relative mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {legalHighlightsTR.map((item, index) => (
              <a
                key={item.title}
                href={legalLinks[index]?.href || "/kullanim-kosullari"}
                className="interactive-card group rounded-2xl border border-slate-200/80 bg-white/70 p-4 backdrop-blur-sm hover:border-orange-200/80 hover:bg-white"
              >
                <p className="text-sm font-extrabold text-slate-900 transition group-hover:text-orange-700">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.08em] text-orange-600 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Oku <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </RevealOnScroll>
    </div>
  );
}
