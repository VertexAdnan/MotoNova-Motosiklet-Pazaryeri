import { useEffect, useMemo, useRef, useState } from "react";
import FilterSidebar, { ListingFilters } from "../components/marketplace/FilterSidebar";
import ListingCard from "../components/marketplace/ListingCard";
import Button from "../components/ui/Button";

export const title = "İlanlar";
export const description = "MotoNova ilan sayfası: gelişmiş filtreleme, sıralama ve modern kart deneyimi.";

type ListingItem = {
  id: string;
  title: string;
  brand: string;
  city: string;
  motorType: string;
  conditionType: string;
  damageState: string;
  timingType: string;
  transmission: string;
  color: string;
  origin: string;
  year: number;
  engineCc: number;
  priceValue: number;
  price: string;
  imageUrl: string;
  featured?: boolean;
};

type SortKey = "newest" | "price-asc" | "price-desc" | "engine-desc";
const PAGE_SIZE = 6;

const defaultFilters: ListingFilters = {
  selectedBrands: [],
  selectedCities: [],
  selectedMotorTypes: [],
  selectedConditionTypes: [],
  selectedDamageStates: [],
  selectedTimingTypes: [],
  selectedTransmissions: [],
  selectedColors: [],
  selectedOrigins: [],
  maxPrice: 1500000,
  minYear: 2014,
  minEngineCc: 125,
  maxEngineCc: 1300,
};

export default function ListingsPage() {
  const [listingData, setListingData] = useState<ListingItem[]>([]);
  const [loadError, setLoadError] = useState("");
  const [filters, setFilters] = useState<ListingFilters>(defaultFilters);
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/listings")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "İlanlar yüklenemedi.");
        }

        if (!cancelled) {
          setListingData(data.listings || []);
          setLoadError("");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setListingData([]);
          setLoadError(error instanceof Error ? error.message : "İlanlar yüklenemedi.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsRefreshing(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const availableBrands = useMemo(
    () => Array.from(new Set(listingData.map((item) => item.brand))).sort((a, b) => a.localeCompare(b, "tr")),
    [listingData]
  );

  const availableCities = useMemo(
    () => Array.from(new Set(listingData.map((item) => item.city))).sort((a, b) => a.localeCompare(b, "tr")),
    [listingData]
  );

  const availableMotorTypes = useMemo(
    () => Array.from(new Set(listingData.map((item) => item.motorType))).sort((a, b) => a.localeCompare(b, "tr")),
    [listingData]
  );

  const availableConditionTypes = useMemo(
    () => Array.from(new Set(listingData.map((item) => item.conditionType))).sort((a, b) => a.localeCompare(b, "tr")),
    [listingData]
  );

  const availableDamageStates = useMemo(
    () => Array.from(new Set(listingData.map((item) => item.damageState))).sort((a, b) => a.localeCompare(b, "tr")),
    [listingData]
  );

  const availableTimingTypes = useMemo(
    () => Array.from(new Set(listingData.map((item) => item.timingType))).sort((a, b) => a.localeCompare(b, "tr")),
    [listingData]
  );

  const availableTransmissions = useMemo(
    () => Array.from(new Set(listingData.map((item) => item.transmission))).sort((a, b) => a.localeCompare(b, "tr")),
    [listingData]
  );

  const availableColors = useMemo(
    () => Array.from(new Set(listingData.map((item) => item.color))).sort((a, b) => a.localeCompare(b, "tr")),
    [listingData]
  );

  const availableOrigins = useMemo(
    () => Array.from(new Set(listingData.map((item) => item.origin))).sort((a, b) => a.localeCompare(b, "tr")),
    [listingData]
  );

  const filteredListings = useMemo(() => {
    const base = listingData.filter((item) => {
      const brandMatch =
        filters.selectedBrands.length === 0 || filters.selectedBrands.includes(item.brand);
      const cityMatch =
        filters.selectedCities.length === 0 || filters.selectedCities.includes(item.city);
      const priceMatch = item.priceValue <= filters.maxPrice;
      const yearMatch = item.year >= filters.minYear;
      const engineMatch =
        item.engineCc >= filters.minEngineCc && item.engineCc <= filters.maxEngineCc;
      const motorTypeMatch =
        filters.selectedMotorTypes.length === 0 || filters.selectedMotorTypes.includes(item.motorType);
      const conditionTypeMatch =
        filters.selectedConditionTypes.length === 0 || filters.selectedConditionTypes.includes(item.conditionType);
      const damageStateMatch =
        filters.selectedDamageStates.length === 0 || filters.selectedDamageStates.includes(item.damageState);
      const timingTypeMatch =
        filters.selectedTimingTypes.length === 0 || filters.selectedTimingTypes.includes(item.timingType);
      const transmissionMatch =
        filters.selectedTransmissions.length === 0 || filters.selectedTransmissions.includes(item.transmission);
      const colorMatch =
        filters.selectedColors.length === 0 || filters.selectedColors.includes(item.color);
      const originMatch =
        filters.selectedOrigins.length === 0 || filters.selectedOrigins.includes(item.origin);

      return (
        brandMatch &&
        cityMatch &&
        priceMatch &&
        yearMatch &&
        engineMatch &&
        motorTypeMatch &&
        conditionTypeMatch &&
        damageStateMatch &&
        timingTypeMatch &&
        transmissionMatch &&
        colorMatch &&
        originMatch
      );
    });

    const sorted = [...base];
    if (sortKey === "price-asc") {
      sorted.sort((a, b) => a.priceValue - b.priceValue);
    }

    if (sortKey === "price-desc") {
      sorted.sort((a, b) => b.priceValue - a.priceValue);
    }

    if (sortKey === "engine-desc") {
      sorted.sort((a, b) => b.engineCc - a.engineCc);
    }

    if (sortKey === "newest") {
      sorted.sort((a, b) => b.year - a.year);
    }

    return sorted;
  }, [filters, listingData, sortKey]);

  const visibleListings = useMemo(
    () => filteredListings.slice(0, visibleCount),
    [filteredListings, visibleCount]
  );

  const hasMore = visibleCount < filteredListings.length;

  useEffect(() => {
    setIsRefreshing(true);
    setVisibleCount(PAGE_SIZE);

    const timeoutId = setTimeout(() => {
      setIsRefreshing(false);
    }, 420);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [filters, sortKey]);

  useEffect(() => {
    if (!sentinelRef.current || !hasMore || isRefreshing) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (!firstEntry?.isIntersecting) {
          return;
        }

        setVisibleCount((current) => Math.min(current + PAGE_SIZE, filteredListings.length));
      },
      { rootMargin: "220px" }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [filteredListings.length, hasMore, isRefreshing]);

  const toggleBrand = (brand: string) => {
    setFilters((current) => ({
      ...current,
      selectedBrands: current.selectedBrands.includes(brand)
        ? current.selectedBrands.filter((item) => item !== brand)
        : [...current.selectedBrands, brand],
    }));
  };

  const toggleCity = (city: string) => {
    setFilters((current) => ({
      ...current,
      selectedCities: current.selectedCities.includes(city)
        ? current.selectedCities.filter((item) => item !== city)
        : [...current.selectedCities, city],
    }));
  };

  const toggleFilterArray = (
    key:
      | "selectedMotorTypes"
      | "selectedConditionTypes"
      | "selectedDamageStates"
      | "selectedTimingTypes"
      | "selectedTransmissions"
      | "selectedColors"
      | "selectedOrigins",
    value: string
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  };

  const handleRangeChange = (
    key: "maxPrice" | "minYear" | "minEngineCc" | "maxEngineCc",
    value: number
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <div className="page-shell py-10 sm:py-14">
      <section className="mb-8 surface-glass relative overflow-hidden rounded-2xl p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" aria-hidden="true" />
        <p className="relative text-xs font-bold uppercase tracking-[0.08em] text-orange-700">MotoNova İlan Merkezi</p>
        <h1 className="relative mt-3 text-3xl font-black text-slate-900 sm:text-4xl">Senin için en doğru motoru seç</h1>
        <p className="relative mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
          Filtrelerini özelleştir, ilanları gerçek zamanlı sırala ve favori listesini oluştur. Mobilde filtre paneli akıcı şekilde açılır.
        </p>
      </section>

      {loadError ? (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      ) : null}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsFilterOpen(true)} className="lg:hidden">
            Filtreleri Aç
          </Button>
          <p className="text-sm font-semibold text-slate-700">
            {filteredListings.length} ilan bulundu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-semibold text-slate-600">
            Sıralama
          </label>
          <select
            id="sort"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="input-base min-w-52"
          >
            <option value="newest">En Yeni</option>
            <option value="price-asc">Fiyat (Artan)</option>
            <option value="price-desc">Fiyat (Azalan)</option>
            <option value="engine-desc">Motor Hacmi (Yüksek)</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="hidden lg:block lg:sticky lg:top-24 lg:h-fit">
          <FilterSidebar
            brands={availableBrands}
            cities={availableCities}
            motorTypes={availableMotorTypes}
            conditionTypes={availableConditionTypes}
            damageStates={availableDamageStates}
            timingTypes={availableTimingTypes}
            transmissions={availableTransmissions}
            colors={availableColors}
            origins={availableOrigins}
            filters={filters}
            onToggleBrand={toggleBrand}
            onToggleCity={toggleCity}
            onToggleMotorType={(value) => toggleFilterArray("selectedMotorTypes", value)}
            onToggleConditionType={(value) => toggleFilterArray("selectedConditionTypes", value)}
            onToggleDamageState={(value) => toggleFilterArray("selectedDamageStates", value)}
            onToggleTimingType={(value) => toggleFilterArray("selectedTimingTypes", value)}
            onToggleTransmission={(value) => toggleFilterArray("selectedTransmissions", value)}
            onToggleColor={(value) => toggleFilterArray("selectedColors", value)}
            onToggleOrigin={(value) => toggleFilterArray("selectedOrigins", value)}
            onRangeChange={handleRangeChange}
            onReset={() => setFilters(defaultFilters)}
          />
        </div>

        <section className="relative">
          <div
            className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-3 transition duration-500 ${
              !isRefreshing && filteredListings.length === 0 ? "opacity-70" : "opacity-100"
            }`}
          >
            {isRefreshing ? (
              Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <article
                  key={`skeleton-${index}`}
                  className="overflow-hidden rounded-card border border-slate-200 bg-white/90 p-4 shadow-soft"
                >
                  <div className="skeleton-shimmer h-44 w-full rounded-xl" />
                  <div className="mt-4 space-y-2">
                    <div className="skeleton-shimmer h-4 w-2/3 rounded-md" />
                    <div className="skeleton-shimmer h-3 w-1/3 rounded-md" />
                    <div className="skeleton-shimmer h-3 w-full rounded-md" />
                    <div className="skeleton-shimmer h-10 w-full rounded-xl" />
                  </div>
                </article>
              ))
            ) : filteredListings.length > 0 ? (
              visibleListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  city={listing.city}
                  year={listing.year}
                  engineCc={listing.engineCc}
                  imageUrl={listing.imageUrl}
                  featured={listing.featured}
                  isFavorite={favoriteIds.includes(listing.id)}
                  onToggleFavorite={() => toggleFavorite(listing.id)}
                  detailHref={`/ilan-detay?ilan=${listing.id}`}
                />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-slate-200 bg-white/80 p-8 text-center shadow-soft">
                <p className="text-lg font-bold text-slate-900">Uygun ilan bulunamadı</p>
                <p className="mt-2 text-sm text-slate-600">
                  {listingData.length === 0
                    ? "Henüz yayınlanmış ilan yok. İlk ilanı sen verebilirsin."
                    : "Filtreleri gevşeterek daha fazla sonuca ulaşabilirsin."}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {listingData.length === 0 ? (
                    <a href="/ilan-ver">
                      <Button>İlan Ver</Button>
                    </a>
                  ) : null}
                  <Button onClick={() => setFilters(defaultFilters)}>Filtreleri Sıfırla</Button>
                </div>
              </div>
            )}
          </div>

          {!isRefreshing && hasMore && (
            <div ref={sentinelRef} className="mt-6 flex items-center justify-center py-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-xs font-semibold text-slate-600 shadow-soft">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-orange-400" />
                Daha fazla ilan yükleniyor
              </div>
            </div>
          )}
        </section>
      </div>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${isFilterOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/45 transition duration-300 ${
            isFilterOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsFilterOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-white p-4 shadow-2xl transition duration-500 ${
            isFilterOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Filtre Paneli</h3>
            <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(false)}>
              Kapat
            </Button>
          </div>
          <FilterSidebar
            brands={availableBrands}
            cities={availableCities}
            motorTypes={availableMotorTypes}
            conditionTypes={availableConditionTypes}
            damageStates={availableDamageStates}
            timingTypes={availableTimingTypes}
            transmissions={availableTransmissions}
            colors={availableColors}
            origins={availableOrigins}
            filters={filters}
            onToggleBrand={toggleBrand}
            onToggleCity={toggleCity}
            onToggleMotorType={(value) => toggleFilterArray("selectedMotorTypes", value)}
            onToggleConditionType={(value) => toggleFilterArray("selectedConditionTypes", value)}
            onToggleDamageState={(value) => toggleFilterArray("selectedDamageStates", value)}
            onToggleTimingType={(value) => toggleFilterArray("selectedTimingTypes", value)}
            onToggleTransmission={(value) => toggleFilterArray("selectedTransmissions", value)}
            onToggleColor={(value) => toggleFilterArray("selectedColors", value)}
            onToggleOrigin={(value) => toggleFilterArray("selectedOrigins", value)}
            onRangeChange={handleRangeChange}
            onReset={() => setFilters(defaultFilters)}
          />
        </div>
      </div>
    </div>
  );
}
