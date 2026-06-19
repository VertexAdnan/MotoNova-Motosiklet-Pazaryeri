import Card from "../ui/Card";

type ListingCardProps = {
  id?: string;
  title: string;
  price: string;
  city: string;
  year: number;
  engineCc: number;
  imageUrl: string;
  featured?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  detailHref?: string;
};

export default function ListingCard({
  title,
  price,
  city,
  year,
  engineCc,
  imageUrl,
  featured = false,
  isFavorite = false,
  onToggleFavorite,
  detailHref,
}: ListingCardProps) {
  return (
    <Card className="interactive-card group overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="listing-image-overlay" />

        <button
          type="button"
          onClick={onToggleFavorite}
          aria-label={`${title} favorilere ekle`}
          className={`absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm backdrop-blur-sm transition-all duration-300 active:scale-90 ${
            isFavorite
              ? "border-red-200 bg-red-50/95 text-red-500 shadow-soft"
              : "border-white/70 bg-white/85 text-slate-500 hover:scale-110 hover:text-red-500"
          }`}
        >
          {isFavorite ? "❤" : "♡"}
        </button>

        {featured && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-primary px-3 py-1 text-xs font-bold text-white shadow-glow-orange">
            Öne Çıkan
          </span>
        )}

        <div className="absolute bottom-3 left-3 z-10 flex gap-2 opacity-0 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-700 backdrop-blur-sm">
            {year}
          </span>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-700 backdrop-blur-sm">
            {engineCc} cc
          </span>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-orange-700">
            {title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <span aria-hidden="true">📍</span>
            {city}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <p className="text-xl font-extrabold text-gradient-brand">{price}</p>
          <a
            href={detailHref || "/ilan-detay"}
            className="inline-flex h-9 items-center justify-center rounded-pill border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 hover:shadow-soft"
          >
            İncele
          </a>
        </div>
      </div>
    </Card>
  );
}
