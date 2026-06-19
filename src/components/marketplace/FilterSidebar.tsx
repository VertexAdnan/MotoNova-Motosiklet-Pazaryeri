import Button from "../ui/Button";

export type ListingFilters = {
  selectedBrands: string[];
  selectedCities: string[];
  selectedMotorTypes: string[];
  selectedConditionTypes: string[];
  selectedDamageStates: string[];
  selectedTimingTypes: string[];
  selectedTransmissions: string[];
  selectedColors: string[];
  selectedOrigins: string[];
  maxPrice: number;
  minYear: number;
  minEngineCc: number;
  maxEngineCc: number;
};

type FilterSidebarProps = {
  brands: string[];
  cities: string[];
  motorTypes: string[];
  conditionTypes: string[];
  damageStates: string[];
  timingTypes: string[];
  transmissions: string[];
  colors: string[];
  origins: string[];
  filters: ListingFilters;
  onToggleBrand: (brand: string) => void;
  onToggleCity: (city: string) => void;
  onToggleMotorType: (motorType: string) => void;
  onToggleConditionType: (conditionType: string) => void;
  onToggleDamageState: (damageState: string) => void;
  onToggleTimingType: (timingType: string) => void;
  onToggleTransmission: (transmission: string) => void;
  onToggleColor: (color: string) => void;
  onToggleOrigin: (origin: string) => void;
  onRangeChange: (key: "maxPrice" | "minYear" | "minEngineCc" | "maxEngineCc", value: number) => void;
  onReset: () => void;
};

function FilterChip({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition duration-300 ${
        checked
          ? "border-orange-300 bg-orange-100 text-orange-800"
          : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-700"
      }`}
    >
      <span
        className={`inline-flex h-3.5 w-3.5 items-center justify-center rounded border text-[10px] ${
          checked
            ? "border-orange-300 bg-orange-500 text-white"
            : "border-slate-300 bg-white text-transparent"
        }`}
      >
        ✓
      </span>
      {label}
    </button>
  );
}

export default function FilterSidebar({
  brands,
  cities,
  motorTypes,
  conditionTypes,
  damageStates,
  timingTypes,
  transmissions,
  colors,
  origins,
  filters,
  onToggleBrand,
  onToggleCity,
  onToggleMotorType,
  onToggleConditionType,
  onToggleDamageState,
  onToggleTimingType,
  onToggleTransmission,
  onToggleColor,
  onToggleOrigin,
  onRangeChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <aside className="surface-glass rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <h3 className="text-base font-extrabold text-slate-900">Filtreler</h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          Sıfırla
        </Button>
      </div>

      <div className="mt-4 space-y-5">
        <section className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Maksimum Fiyat</p>
          <input
            type="range"
            min={100000}
            max={1500000}
            step={25000}
            value={filters.maxPrice}
            onChange={(event) => onRangeChange("maxPrice", Number(event.target.value))}
            className="w-full accent-orange-500"
          />
          <p className="text-sm font-semibold text-slate-700">{filters.maxPrice.toLocaleString("tr-TR")} TL</p>
        </section>

        <section className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Minimum Yıl</p>
          <input
            type="range"
            min={2014}
            max={2026}
            step={1}
            value={filters.minYear}
            onChange={(event) => onRangeChange("minYear", Number(event.target.value))}
            className="w-full accent-orange-500"
          />
          <p className="text-sm font-semibold text-slate-700">{filters.minYear}</p>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Motor Hacmi (cc)</p>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              className="input-base"
              value={filters.minEngineCc}
              onChange={(event) => onRangeChange("minEngineCc", Number(event.target.value))}
            />
            <input
              type="number"
              className="input-base"
              value={filters.maxEngineCc}
              onChange={(event) => onRangeChange("maxEngineCc", Number(event.target.value))}
            />
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Marka</p>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <FilterChip
                key={brand}
                checked={filters.selectedBrands.includes(brand)}
                label={brand}
                onClick={() => onToggleBrand(brand)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Sehir</p>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <FilterChip
                key={city}
                checked={filters.selectedCities.includes(city)}
                label={city}
                onClick={() => onToggleCity(city)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Motor Tipi</p>
          <div className="flex flex-wrap gap-2">
            {motorTypes.map((motorType) => (
              <FilterChip
                key={motorType}
                checked={filters.selectedMotorTypes.includes(motorType)}
                label={motorType}
                onClick={() => onToggleMotorType(motorType)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Durum</p>
          <div className="flex flex-wrap gap-2">
            {conditionTypes.map((conditionType) => (
              <FilterChip
                key={conditionType}
                checked={filters.selectedConditionTypes.includes(conditionType)}
                label={conditionType}
                onClick={() => onToggleConditionType(conditionType)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Hasar Durumu</p>
          <div className="flex flex-wrap gap-2">
            {damageStates.map((damageState) => (
              <FilterChip
                key={damageState}
                checked={filters.selectedDamageStates.includes(damageState)}
                label={damageState}
                onClick={() => onToggleDamageState(damageState)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Zamanlama</p>
          <div className="flex flex-wrap gap-2">
            {timingTypes.map((timingType) => (
              <FilterChip
                key={timingType}
                checked={filters.selectedTimingTypes.includes(timingType)}
                label={timingType}
                onClick={() => onToggleTimingType(timingType)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Vites</p>
          <div className="flex flex-wrap gap-2">
            {transmissions.map((transmission) => (
              <FilterChip
                key={transmission}
                checked={filters.selectedTransmissions.includes(transmission)}
                label={transmission}
                onClick={() => onToggleTransmission(transmission)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Renk</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <FilterChip
                key={color}
                checked={filters.selectedColors.includes(color)}
                label={color}
                onClick={() => onToggleColor(color)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Menşei</p>
          <div className="flex flex-wrap gap-2">
            {origins.map((origin) => (
              <FilterChip
                key={origin}
                checked={filters.selectedOrigins.includes(origin)}
                label={origin}
                onClick={() => onToggleOrigin(origin)}
              />
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
