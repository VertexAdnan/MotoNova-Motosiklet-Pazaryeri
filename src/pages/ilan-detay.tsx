import { useEffect, useMemo, useState } from "react";
import ImageGallery from "../components/marketplace/ImageGallery";
import ListingCard from "../components/marketplace/ListingCard";
import Button from "../components/ui/Button";

export const title = "İlan Detayı";
export const description = "MotoNova ilan detay sayfası: görsel galeri, teknik bilgiler, satıcı paneli ve benzer ilanlar.";

type ListingDetail = {
  id: string;
  title: string;
  city: string;
  district: string;
  price: string;
  year: number;
  km: number;
  engineCc: number;
  gear: string;
  fuel: string;
  condition: string;
  color: string;
  adDate: string;
  description: string;
  images: string[];
  seller: {
    name: string;
    memberSince: string;
    responseRate: string;
    phone: string;
  };
};

type SimilarListing = {
  id: string;
  title: string;
  price: string;
  city: string;
  year: number;
  engineCc: number;
  imageUrl: string;
};

export default function ListingDetailPage() {
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [similarListings, setSimilarListings] = useState<SimilarListing[]>([]);
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const queryId = new URLSearchParams(window.location.search).get("ilan");
    if (!queryId) {
      setLoadError("İlan kimliği bulunamadı.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    fetch(`/api/listings/detail?id=${encodeURIComponent(queryId)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "İlan detayı yüklenemedi.");
        }

        if (!cancelled) {
          setListing(data.listing);
          setSimilarListings(data.similar || []);
          setLoadError("");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setListing(null);
          setSimilarListings([]);
          setLoadError(error instanceof Error ? error.message : "İlan detayı yüklenemedi.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const pageTitle = useMemo(() => listing?.title || "İlan Detayı", [listing]);

  if (isLoading) {
    return (
      <div className="page-shell py-10 sm:py-14">
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-8 shadow-soft">
          <div className="skeleton-shimmer h-8 w-1/2 rounded-md" />
          <div className="mt-4 skeleton-shimmer h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (loadError || !listing) {
    return (
      <div className="page-shell py-10 sm:py-14">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-soft">
          <p className="text-lg font-bold text-slate-900">{loadError || "İlan bulunamadı."}</p>
          <div className="mt-4">
            <a href="/ilanlar">
              <Button>İlanlara Dön</Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-10 sm:py-14">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
        <a href="/" className="hover:text-slate-700">Ana Sayfa</a>
        <span>/</span>
        <a href="/ilanlar" className="hover:text-slate-700">İlanlar</a>
        <span>/</span>
        <span className="text-orange-700">{pageTitle}</span>
      </div>

      <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">{listing.title}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {listing.city} / {listing.district} • İlan No: {listing.id.toUpperCase()} • Tarih: {listing.adDate}
          </p>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">Fiyat</p>
          <p className="mt-1 text-3xl font-black text-orange-700">{listing.price}</p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <ImageGallery images={listing.images} alt={listing.title} />

          <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-soft sm:p-6">
            <h2 className="text-xl font-extrabold text-slate-900">Teknik Özellikler</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["Model Yılı", String(listing.year)],
                ["Kilometre", `${listing.km.toLocaleString("tr-TR")} km`],
                ["Motor Hacmi", `${listing.engineCc} cc`],
                ["Vites", listing.gear],
                ["Yakıt", listing.fuel],
                ["Durum", listing.condition],
                ["Renk", listing.color],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="text-sm font-bold text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-soft sm:p-6">
            <h2 className="text-xl font-extrabold text-slate-900">Açıklama</h2>
            <p className="mt-3 leading-7 text-slate-600">{listing.description || "Satıcı açıklama eklemedi."}</p>
          </section>
        </div>

        <aside className="xl:sticky xl:top-24 xl:h-fit">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Satıcı Bilgisi</p>
              <p className="mt-2 text-lg font-extrabold text-slate-900">{listing.seller.name}</p>
              <p className="mt-1 text-sm text-slate-600">Üyelik: {listing.seller.memberSince} • Yanıtlama: {listing.seller.responseRate}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Telefon</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{listing.seller.phone}</p>
            </div>

            <Button className="w-full" size="lg">Satıcıya Mesaj Gönder</Button>
            <Button className="w-full" variant="outline" size="lg">Telefon Numarasını Göster</Button>
            <Button className="w-full" variant="secondary" size="lg">Favorilere Ekle</Button>

            <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm text-slate-700">
              <p className="font-bold text-slate-900">Güvenli alışveriş bildirimi</p>
              <p className="mt-1">
                MotoNova bir aracı platformdur. Şüpheli, yanıltıcı veya hukuka aykırı içerik fark edersen ilanı raporlayabilirsin.
              </p>
              <a href="/kullanim-kosullari" className="mt-2 inline-flex font-semibold text-orange-700 hover:text-orange-800">
                Şüpheli ilanı bildir / kullanım koşulları
              </a>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-12">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="section-title">Benzer İlanlar</h2>
          <a href="/ilanlar" className="text-sm font-semibold text-orange-700 hover:text-orange-800">Tüm ilanlara dön</a>
        </div>

        {similarListings.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {similarListings.map((item) => (
              <ListingCard
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                city={item.city}
                year={item.year}
                engineCc={item.engineCc}
                imageUrl={item.imageUrl}
                detailHref={`/ilan-detay?ilan=${item.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 text-sm text-slate-600 shadow-soft">
            Bu ilana benzer başka ilan bulunamadı.
          </div>
        )}
      </section>
    </div>
  );
}
