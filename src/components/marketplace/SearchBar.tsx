import Button from "../ui/Button";
import { useMemo, useState } from "react";
import SearchableSelect, { SelectOption } from "../ui/SearchableSelect";
import {
  brandsTR,
  modelsByBrandIdTR,
  modelsTR,
  provincesTR,
  type CatalogBrand,
  type CatalogModel,
  type CatalogProvince,
} from "../../utils/motorcycle-catalog.ts";

type SearchValues = {
  brandIds: string[];
  modelIds: string[];
  provinceIds: string[];
  price: string;
};

type SearchBarProps = {
  values?: SearchValues;
};

const priceRanges = [
  "0 - 150.000 TL",
  "150.000 TL - 300.000 TL",
  "300.000 TL - 500.000 TL",
  "500.000 TL - 800.000 TL",
  "800.000 TL+",
];

export default function SearchBar({
  values = {
    brandIds: ["brand_yamaha"],
    modelIds: ["model_yamaha_mt-07"],
    provinceIds: ["province_34"],
    price: "250.000 TL - 500.000 TL",
  },
}: SearchBarProps) {
  const [selectedProvinceIds, setSelectedProvinceIds] = useState<string[]>(values.provinceIds);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(values.brandIds);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(values.modelIds);
  const [price, setPrice] = useState(values.price);

  const provinceOptions: SelectOption[] = provincesTR.map((province: CatalogProvince) => ({
    id: province.id,
    label: province.name,
    keywords: [String(province.plateCode)],
  }));

  const brandOptions: SelectOption[] = brandsTR.map((brand: CatalogBrand) => ({
    id: brand.id,
    label: brand.name,
  }));

  const modelPool = useMemo(() => {
    if (selectedBrandIds.length === 0) {
      return modelsTR;
    }

    return selectedBrandIds.flatMap((brandId) => modelsByBrandIdTR[brandId] ?? []);
  }, [selectedBrandIds]);

  const modelOptions: SelectOption[] = modelPool.map((model: CatalogModel) => ({
    id: model.id,
    label: model.name,
  }));

  const handleBrandChange = (nextBrandIds: string[]) => {
    setSelectedBrandIds(nextBrandIds);

    if (nextBrandIds.length === 0) {
      setSelectedModelIds([]);
      return;
    }

    setSelectedModelIds((prevModelIds) =>
      prevModelIds.filter((modelId) => {
        const model = modelsTR.find((item: CatalogModel) => item.id === modelId);
        return model ? nextBrandIds.includes(model.brandId) : false;
      })
    );
  };

  return (
    <form className="surface-glass relative overflow-hidden rounded-2xl p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-orange-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">Akıllı Arama</p>
          <h2 className="mt-1 text-lg font-extrabold text-slate-900">Hayalindeki motoru filtrele</h2>
        </div>
        <span className="badge-live rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          Canlı sonuçlar
        </span>
      </div>

      <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="search-label" htmlFor="province-select">
            İller
          </label>
          <SearchableSelect
            id="province-select"
            placeholder="İl seç"
            options={provinceOptions}
            selectedIds={selectedProvinceIds}
            onChange={setSelectedProvinceIds}
            multiple
            emptyText="İl bulunamadı"
          />
        </div>

        <div>
          <label className="search-label" htmlFor="brand-select">
            Markalar
          </label>
          <SearchableSelect
            id="brand-select"
            placeholder="Marka seç"
            options={brandOptions}
            selectedIds={selectedBrandIds}
            onChange={handleBrandChange}
            multiple
            emptyText="Marka bulunamadı"
          />
        </div>

        <div>
          <label className="search-label" htmlFor="model-select">
            Modeller
          </label>
          <SearchableSelect
            id="model-select"
            placeholder="Model seç"
            options={modelOptions}
            selectedIds={selectedModelIds}
            onChange={setSelectedModelIds}
            multiple
            emptyText="Model bulunamadı"
          />
        </div>

        <div>
          <label className="search-label" htmlFor="price">
            Fiyat Aralığı
          </label>
          <select
            id="price"
            className="input-base"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          >
            {priceRanges.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60 pt-5">
        <p className="text-sm text-slate-500">Gelişmiş filtrelerle aradığın motosikleti saniyeler içinde bul.</p>
        <Button type="submit" variant="primary" size="lg">
          İlan Ara
        </Button>
      </div>
    </form>
  );
}
