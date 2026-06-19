import { type FormEvent, useEffect, useMemo, useState } from "react";
import ImageUploadField from "../components/marketplace/ImageUploadField";
import SearchableSelect, { SelectOption } from "../components/ui/SearchableSelect";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";
import { legalHighlightsTR, mandatoryListingConsents } from "../config/legal";
import { getMotorcycleSpecsSuggestion } from "../helpers/motorcycle-specs";
import {
  brandsTR,
  provincesTR,
  type CatalogBrand,
  type CatalogProvince,
} from "../utils/motorcycle-catalog";

export const title = "İlan Ver";
export const description = "MotoNova ilan oluşturma formu: zorunlu onaylar, satıcı tipi ve yasal uyum akışları.";

const CUSTOM_MODEL_OPTION_ID = "__custom_model__";

const motorTypes = ["Spor", "Naked", "Adventure", "Touring", "Cruiser", "Scooter", "Cross"];
const conditionTypes = ["Sıfır", "İkinci El"];
const transmissionTypes = ["Manuel", "Yarı Otomatik", "Otomatik"];
const timingTypes = ["2 Zamanlı", "4 Zamanlı", "Elektrikli"];
const fuelTypes = ["Benzin", "Elektrik", "Hibrit"];
const damageStates = ["Hasarsız", "Lokal Boyalı", "Değişensiz", "Tramer Kayıtlı"];
const colorOptions = ["Siyah", "Beyaz", "Kırmızı", "Mavi", "Gri", "Yeşil", "Turuncu"];
const originOptions = ["Japonya", "Almanya", "İtalya", "İngiltere", "Avusturya", "Türkiye"];

export default function CreateListingPage() {
  const [sellerType, setSellerType] = useState<"bireysel" | "kurumsal">("bireysel");
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [titleValue, setTitleValue] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [district, setDistrict] = useState("");
  const [year, setYear] = useState("");
  const [km, setKm] = useState("");
  const [engineCc, setEngineCc] = useState("");
  const [horsepowerHp, setHorsepowerHp] = useState("");
  const [torqueNm, setTorqueNm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [topSpeedKph, setTopSpeedKph] = useState("");
  const [fuelTankL, setFuelTankL] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [motorType, setMotorType] = useState(motorTypes[0]);
  const [conditionType, setConditionType] = useState(conditionTypes[1]);
  const [transmission, setTransmission] = useState(transmissionTypes[0]);
  const [timingType, setTimingType] = useState(timingTypes[1]);
  const [fuelType, setFuelType] = useState(fuelTypes[0]);
  const [damageState, setDamageState] = useState(damageStates[0]);
  const [color, setColor] = useState(colorOptions[0]);
  const [origin, setOrigin] = useState(originOptions[0]);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [catalogBrands, setCatalogBrands] = useState<CatalogBrand[]>(brandsTR);
  const [catalogModels, setCatalogModels] = useState<Array<{ id: string; name: string }>>([]);
  const [usesCustomModel, setUsesCustomModel] = useState(false);
  const [customModelName, setCustomModelName] = useState("");
  const [customModelYearFrom, setCustomModelYearFrom] = useState("");
  const [customModelNotes, setCustomModelNotes] = useState("");
  const [modelRequestNotice, setModelRequestNotice] = useState("");
  const [isSubmittingModelRequest, setIsSubmittingModelRequest] = useState(false);
  const [selectedProvinceIds, setSelectedProvinceIds] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoFillState, setAutoFillState] = useState<{
    status: "idle" | "loading" | "success" | "warning";
    message: string;
    sourceLabel?: string;
  }>({
    status: "idle",
    message: "Bir model seçildiğinde teknik özellikler yardımcı veri ile önerilir.",
  });

  const requiredAccepted = useMemo(
    () => mandatoryListingConsents.filter((item) => item.required).every((item) => accepted[item.id]),
    [accepted]
  );

  const provinceOptions: SelectOption[] = provincesTR.map((province: CatalogProvince) => ({
    id: province.id,
    label: province.name,
    keywords: [String(province.plateCode)],
  }));

  const brandOptions: SelectOption[] = catalogBrands.map((brand: CatalogBrand) => ({
    id: brand.id,
    label: brand.name,
  }));

  const selectedBrandId = selectedBrandIds[0] || "";

  useEffect(() => {
    fetch("/api/catalog/brands")
      .then(async (response) => {
        const data = await response.json();
        if (response.ok && Array.isArray(data.brands) && data.brands.length > 0) {
          setCatalogBrands(data.brands);
        }
      })
      .catch(() => {
        setCatalogBrands(brandsTR);
      });
  }, []);

  useEffect(() => {
    if (!selectedBrandId) {
      setCatalogModels([]);
      return;
    }

    let cancelled = false;

    fetch(`/api/catalog/models?brandId=${encodeURIComponent(selectedBrandId)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!cancelled && response.ok && Array.isArray(data.models)) {
          setCatalogModels(data.models.map((model: { id: string; name: string }) => ({
            id: model.id,
            name: model.name,
          })));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCatalogModels([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedBrandId]);

  const modelOptions: SelectOption[] = [
    ...catalogModels.map((model) => ({
      id: model.id,
      label: model.name,
    })),
    {
      id: CUSTOM_MODEL_OPTION_ID,
      label: "Motorum listede yok",
      keywords: ["yok", "eksik", "basvuru", "başvuru"],
    },
  ];

  const hasValidModelSelection =
    (selectedModelIds.length > 0 && !usesCustomModel) ||
    (usesCustomModel && customModelName.trim().length >= 2);

  const completedItems = [
    titleValue.trim().length >= 12,
    priceValue.trim().length > 0,
    selectedBrandIds.length > 0,
    hasValidModelSelection,
    selectedProvinceIds.length > 0,
    district.trim().length > 0,
    year.trim().length > 0,
    km.trim().length > 0,
    engineCc.trim().length > 0,
    horsepowerHp.trim().length > 0,
    torqueNm.trim().length > 0,
    weightKg.trim().length > 0,
    descriptionValue.trim().length >= 120,
    imageFiles.length >= 3,
  ];

  const qualityScore = Math.round(
    (completedItems.filter(Boolean).length / completedItems.length) * 100
  );

  const publishReady = requiredAccepted && qualityScore >= 80;

  const qualityLabel =
    qualityScore >= 85 ? "Yayına çok hazır" : qualityScore >= 60 ? "Geliştirilebilir" : "Eksik alanlar var";

  const selectedBrandLabel = brandOptions.find((item) => item.id === selectedBrandId)?.label || "Seçilmedi";
  const selectedModelId = usesCustomModel ? "" : selectedModelIds[0] || "";
  const selectedModelLabel = usesCustomModel
    ? customModelName.trim() || "Özel model"
    : modelOptions.find((item) => item.id === selectedModelId)?.label || "Seçilmedi";
  const selectedProvinceLabel = provinceOptions.find((item) => item.id === selectedProvinceIds[0])?.label || "Seçilmedi";

  const handleModelChange = (ids: string[]) => {
    const nextId = ids[0] || "";
    if (nextId === CUSTOM_MODEL_OPTION_ID) {
      setUsesCustomModel(true);
      setSelectedModelIds([CUSTOM_MODEL_OPTION_ID]);
      return;
    }

    setUsesCustomModel(false);
    setCustomModelName("");
    setCustomModelYearFrom("");
    setCustomModelNotes("");
    setModelRequestNotice("");
    setSelectedModelIds(ids);
  };

  const handleSubmitModelRequest = async () => {
    if (!selectedBrandLabel || selectedBrandLabel === "Seçilmedi") {
      setModelRequestNotice("Önce marka seçmelisin.");
      return;
    }

    if (customModelName.trim().length < 2) {
      setModelRequestNotice("Model adını en az 2 karakter olarak yaz.");
      return;
    }

    setIsSubmittingModelRequest(true);
    setModelRequestNotice("");

    try {
      const response = await fetch("/api/catalog/model-requests", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: selectedBrandLabel,
          modelName: customModelName.trim(),
          yearFrom: customModelYearFrom ? Number(customModelYearFrom) : undefined,
          notes: customModelNotes.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || "Başvuru gönderilemedi.");
      }

      setModelRequestNotice("Başvurun alındı. Onaylandığında kataloga eklenecek.");
    } catch (error) {
      setModelRequestNotice(error instanceof Error ? error.message : "Başvuru gönderilemedi.");
    } finally {
      setIsSubmittingModelRequest(false);
    }
  };

  useEffect(() => {
    if (!selectedBrandId || !selectedModelId || usesCustomModel) {
      setAutoFillState({
        status: "idle",
        message: "Bir model seçildiğinde teknik özellikler yardımcı veri ile önerilir.",
      });
      return;
    }

    let isCancelled = false;

    setAutoFillState({
      status: "loading",
      message: `${selectedBrandLabel} ${selectedModelLabel} için teknik veriler getiriliyor...`,
    });

    getMotorcycleSpecsSuggestion({
      brandName: selectedBrandLabel,
      modelName: selectedModelLabel,
    }).then((specs) => {
      if (isCancelled || !specs) {
        return;
      }

      setMotorType(specs.motorType);
      setHorsepowerHp(specs.horsepowerHp);
      setTorqueNm(specs.torqueNm);
      setWeightKg(specs.weightKg);
      setTopSpeedKph(specs.topSpeedKph);
      setFuelTankL(specs.fuelTankL);
      setEngineCc(specs.engineCc);
      setTransmission(specs.transmission);
      setTimingType(specs.timingType);
      setFuelType(specs.fuelType);
      setOrigin(specs.origin);
      setAutoFillState({
        status: specs.confidence === "high" ? "success" : "warning",
        message: `${selectedBrandLabel} ${selectedModelLabel} için teknik alanlar otomatik dolduruldu. İstersen düzenleyebilirsin.`,
        sourceLabel: specs.sourceLabel,
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedBrandId, selectedBrandLabel, selectedModelId, selectedModelLabel, usesCustomModel]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!publishReady) {
      setNotice({
        type: "error",
        text: "İlanı yayına göndermek için zorunlu onayları tamamla ve kalite skorunu yükselt.",
      });
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    try {
      const imageUrls: string[] = [];

      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadData.files?.[0]?.url) {
          throw new Error(uploadData.error || "Görseller yüklenemedi.");
        }

        imageUrls.push(uploadData.files[0].url);
      }

      if (usesCustomModel && customModelName.trim().length >= 2) {
        await fetch("/api/catalog/model-requests", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brandName: selectedBrandLabel,
            modelName: customModelName.trim(),
            yearFrom: customModelYearFrom ? Number(customModelYearFrom) : undefined,
            notes: customModelNotes.trim() || "İlan verme sırasında otomatik başvuru",
          }),
        }).catch(() => undefined);
      }

      const response = await fetch("/api/listings", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: titleValue,
          price: priceValue,
          brand: selectedBrandLabel,
          model: selectedModelLabel,
          city: selectedProvinceLabel,
          district,
          motorType,
          conditionType,
          damageState,
          timingType,
          transmission,
          fuelType,
          color,
          origin,
          year: Number(year),
          km: Number(km),
          engineCc: Number(engineCc),
          description: descriptionValue,
          images: imageUrls,
          status: "published",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "İlan oluşturulamadı.");
      }

      setNotice({
        type: "success",
        text: "İlanın başarıyla yayınlandı. Yönlendiriliyorsun...",
      });

      setTimeout(() => {
        window.location.href = `/ilan-detay?ilan=${data.listing.id}`;
      }, 900);
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "İlan yayınlanırken bir hata oluştu.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraftSave = () => {
    setNotice({
      type: "success",
      text: "Taslak arayüz olarak kaydedilmeye hazır. Backend taslak servisi bağlandığında otomatik saklanacak.",
    });
  };

  return (
    <div className="page-shell py-10 sm:py-14">
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">Production Hazır İlan Akışı</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">MotoNova’da detaylı ve güven veren bir ilan oluştur</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
              Kullanıcı deneyimi odaklı bu akış; görsel kalite, doğru teknik bilgiler, güvenli iletişim ve Türkiye mevzuatına uygun onay yapısı ile tasarlanmıştır.
            </p>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">İlan kalite puanı</p>
            <p className="mt-1 text-2xl font-black text-slate-900">%{qualityScore}</p>
            <p className="text-xs text-slate-600">{qualityLabel}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="category-chip">1. Temel bilgiler</span>
          <span className="category-chip">2. Görseller</span>
          <span className="category-chip">3. Teknik detaylar</span>
          <span className="category-chip">4. Yasal onay</span>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Temel İlan Bilgileri</h2>
              <p className="mt-1 text-sm text-slate-600">Net ve güven veren bir başlık ile başla. Kullanıcı önce burada karar verir.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                id="listing-title"
                label="İlan başlığı"
                placeholder="Örn: 2023 Yamaha MT-07 ABS, hatasız, düşük km"
                value={titleValue}
                onChange={(event) => setTitleValue(event.target.value)}
                hint={`${titleValue.length}/70 karakter`}
              />

              <FormInput
                id="listing-price"
                label="Fiyat"
                placeholder="Örn: 465.000 TL"
                value={priceValue}
                onChange={(event) => setPriceValue(event.target.value)}
              />

              <label className="block">
                <span className="search-label">Marka</span>
                <SearchableSelect
                  id="listing-brand"
                  placeholder="Marka seç"
                  options={brandOptions}
                  selectedIds={selectedBrandIds}
                  onChange={(ids) => {
                    setSelectedBrandIds(ids);
                    setSelectedModelIds([]);
                    setUsesCustomModel(false);
                    setCustomModelName("");
                    setCustomModelYearFrom("");
                    setCustomModelNotes("");
                    setModelRequestNotice("");
                    setEngineCc("");
                    setHorsepowerHp("");
                    setTorqueNm("");
                    setWeightKg("");
                    setTopSpeedKph("");
                    setFuelTankL("");
                    setAutoFillState({
                      status: "idle",
                      message: "Yeni model seçildiğinde teknik özellikler tekrar önerilir.",
                    });
                  }}
                />
              </label>

              <label className="block">
                <span className="search-label">Model</span>
                <SearchableSelect
                  id="listing-model"
                  placeholder={selectedBrandIds.length === 0 ? "Önce marka seç" : "Model seç"}
                  options={modelOptions}
                  selectedIds={selectedModelIds}
                  onChange={handleModelChange}
                  emptyText="Model bulunamadı"
                />
              </label>

              {usesCustomModel ? (
                <div className="sm:col-span-2 rounded-2xl border border-orange-200 bg-orange-50 p-4">
                  <p className="text-sm font-extrabold text-slate-900">Motorum listede yok</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Model adını yaz ve başvuru gönder. Onaylandığında kataloga eklenir; ilanını yine de yayınlayabilirsin.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <FormInput
                      id="custom-model-name"
                      label="Model adı"
                      placeholder="Örn: Dragstar 250"
                      value={customModelName}
                      onChange={(event) => setCustomModelName(event.target.value)}
                      required
                    />
                    <FormInput
                      id="custom-model-year"
                      label="Üretim yılı (opsiyonel)"
                      placeholder="Örn: 2003"
                      value={customModelYearFrom}
                      onChange={(event) => setCustomModelYearFrom(event.target.value)}
                    />
                    <label className="block sm:col-span-2">
                      <span className="search-label">Ek not (opsiyonel)</span>
                      <textarea
                        className="input-base min-h-24"
                        placeholder="Varsa kasa tipi, motor hacmi veya piyasa adı..."
                        value={customModelNotes}
                        onChange={(event) => setCustomModelNotes(event.target.value)}
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmittingModelRequest}
                      onClick={handleSubmitModelRequest}
                    >
                      {isSubmittingModelRequest ? "Gönderiliyor..." : "Katalog Başvurusu Gönder"}
                    </Button>
                    {modelRequestNotice ? (
                      <p className="text-sm font-semibold text-slate-700">{modelRequestNotice}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <label className="block">
                <span className="search-label">İl</span>
                <SearchableSelect
                  id="listing-province"
                  placeholder="İl seç"
                  options={provinceOptions}
                  selectedIds={selectedProvinceIds}
                  onChange={setSelectedProvinceIds}
                />
              </label>

              <FormInput
                id="listing-district"
                label="İlçe"
                placeholder="Örn: Kadıköy"
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
              />

              <label className="block">
                <span className="search-label">Satıcı tipi</span>
                <select className="input-base" value={sellerType} onChange={(e) => setSellerType(e.target.value as "bireysel" | "kurumsal")}>
                  <option value="bireysel">Bireysel Satıcı</option>
                  <option value="kurumsal">Kurumsal Satıcı</option>
                </select>
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Fotoğraf ve Vitrin</h2>
              <p className="mt-1 text-sm text-slate-600">Kaliteli fotoğraflar ilan performansını ciddi ölçüde artırır.</p>
            </div>
            <ImageUploadField files={imageFiles} onChange={setImageFiles} />
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Teknik Özellikler</h2>
              <p className="mt-1 text-sm text-slate-600">Arama ve filtreleme kalitesini yükseltmek için teknik bilgileri doğru gir.</p>
            </div>

            <div className={`rounded-2xl border px-4 py-3 text-sm ${
              autoFillState.status === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : autoFillState.status === "warning"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : autoFillState.status === "loading"
                    ? "border-sky-200 bg-sky-50 text-sky-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
            }`}>
              <p className="font-semibold">{autoFillState.message}</p>
              <p className="mt-1 text-xs opacity-80">Kaynak: {autoFillState.sourceLabel ?? "Model seçimi bekleniyor"}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label className="block">
                <span className="search-label">Motor tipi</span>
                <select className="input-base" value={motorType} onChange={(e) => setMotorType(e.target.value)}>
                  {motorTypes.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="search-label">Durum</span>
                <select className="input-base" value={conditionType} onChange={(e) => setConditionType(e.target.value)}>
                  {conditionTypes.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <FormInput id="listing-year" label="Model yılı" placeholder="2023" value={year} onChange={(e) => setYear(e.target.value)} />
              <FormInput id="listing-km" label="Kilometre" placeholder="7300" value={km} onChange={(e) => setKm(e.target.value)} />
              <FormInput id="listing-engine" label="Motor hacmi (cc)" placeholder="689" value={engineCc} onChange={(e) => setEngineCc(e.target.value)} />
              <FormInput id="listing-hp" label="Beygir gücü (hp)" placeholder="73" value={horsepowerHp} onChange={(e) => setHorsepowerHp(e.target.value)} />
              <FormInput id="listing-torque" label="Tork (Nm)" placeholder="67" value={torqueNm} onChange={(e) => setTorqueNm(e.target.value)} />
              <FormInput id="listing-weight" label="Ağırlık (kg)" placeholder="184" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
              <FormInput id="listing-top-speed" label="Son hız (km/s)" placeholder="214" value={topSpeedKph} onChange={(e) => setTopSpeedKph(e.target.value)} />
              <FormInput id="listing-fuel-tank" label="Depo hacmi (lt)" placeholder="14" value={fuelTankL} onChange={(e) => setFuelTankL(e.target.value)} />

              <label className="block">
                <span className="search-label">Vites</span>
                <select className="input-base" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                  {transmissionTypes.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="search-label">Zamanlama</span>
                <select className="input-base" value={timingType} onChange={(e) => setTimingType(e.target.value)}>
                  {timingTypes.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="search-label">Yakıt</span>
                <select className="input-base" value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
                  {fuelTypes.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="search-label">Hasar durumu</span>
                <select className="input-base" value={damageState} onChange={(e) => setDamageState(e.target.value)}>
                  {damageStates.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="search-label">Renk</span>
                <select className="input-base" value={color} onChange={(e) => setColor(e.target.value)}>
                  {colorOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="search-label">Menşei</span>
                <select className="input-base" value={origin} onChange={(e) => setOrigin(e.target.value)}>
                  {originOptions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Açıklama</h2>
              <p className="mt-1 text-sm text-slate-600">Bakım geçmişi, aksesuarlar, değişen parçalar ve kullanım durumu burada güven oluşturur.</p>
            </div>

            <label className="block">
              <span className="search-label">Detaylı açıklama</span>
              <textarea
                className="min-h-40 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-200"
                placeholder="Motorun bakım geçmişi, kondisyonu, varsa aksesuarları ve satış nedeni gibi detayları yaz..."
                value={descriptionValue}
                onChange={(event) => setDescriptionValue(event.target.value)}
              />
              <span className="mt-1 block text-xs text-slate-500">{descriptionValue.length}/1500 karakter</span>
            </label>
          </section>

          {sellerType === "kurumsal" && (
            <section className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <h3 className="text-sm font-extrabold text-slate-900">Kurumsal satıcı bilgileri</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input className="input-base" placeholder="Şirket unvanı" />
                <input className="input-base" placeholder="VKN / MERSİS No" />
                <input className="input-base sm:col-span-2" placeholder="Yetki Belgesi No (varsa)" />
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-extrabold text-slate-900">Zorunlu Onaylar</h2>
            <div className="mt-4 space-y-3">
              {mandatoryListingConsents.map((consent) => (
                <label key={consent.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={Boolean(accepted[consent.id])}
                    onChange={(event) =>
                      setAccepted((current) => ({
                        ...current,
                        [consent.id]: event.target.checked,
                      }))
                    }
                    className="mt-1"
                  />
                  <span className="text-sm text-slate-700">
                    {consent.label}
                    {consent.required && <strong className="ml-1 text-orange-700">(Zorunlu)</strong>}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {notice ? (
            <p className={`rounded-xl px-3 py-2 text-sm ${notice.type === "success" ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
              {notice.text}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" className="min-w-44" disabled={!publishReady || isSubmitting}>
              {isSubmitting ? "Yayınlanıyor..." : "İlanı Yayına Gönder"}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={handleDraftSave}>Taslak Kaydet</Button>
            <Button type="button" variant="secondary" size="lg">Önizleme</Button>
          </div>
        </form>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-extrabold text-slate-900">İlan Özeti</h3>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">%{qualityScore}</span>
            </div>

            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-brand-primary transition-all duration-500" style={{ width: `${qualityScore}%` }} />
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">Başlık</p>
                <p className="mt-1">{titleValue || "Henüz girilmedi"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">Seçimler</p>
                <p className="mt-1">{selectedBrandLabel} • {selectedModelLabel}</p>
                <p className="mt-1">{selectedProvinceLabel} / {district || "İlçe bekleniyor"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">Vitrin gücü</p>
                <p className="mt-1">{imageFiles.length} fotoğraf eklendi</p>
                <p className="mt-1">Açıklama uzunluğu: {descriptionValue.length} karakter</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">Teknik veri önerisi</p>
                <p className="mt-1">{horsepowerHp || "-"} hp • {torqueNm || "-"} Nm • {weightKg || "-"} kg</p>
                <p className="mt-1 text-xs text-slate-500">{autoFillState.sourceLabel ?? "Henüz veri uygulanmadı"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <h3 className="text-base font-extrabold text-slate-900">Yayın öncesi kontrol</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>{titleValue.length >= 12 ? "✅" : "•"} Güçlü başlık</p>
              <p>{imageFiles.length >= 3 ? "✅" : "•"} Yeterli fotoğraf</p>
              <p>{horsepowerHp && torqueNm && weightKg ? "✅" : "•"} Teknik veriler dolu</p>
              <p>{descriptionValue.length >= 120 ? "✅" : "•"} Doyurucu açıklama</p>
              <p>{requiredAccepted ? "✅" : "•"} Zorunlu onaylar</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <h3 className="text-base font-extrabold text-slate-900">Türkiye uyum başlıkları</h3>
            <div className="mt-4 space-y-3">
              {legalHighlightsTR.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-bold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-soft">
            <h3 className="text-base font-extrabold text-slate-900">Yasal belgelere hızlı erişim</h3>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <a href="/kvkk-aydinlatma" className="font-semibold text-orange-700 hover:text-orange-800">KVKK Aydınlatma Metni</a>
              <a href="/gizlilik-politikasi" className="font-semibold text-orange-700 hover:text-orange-800">Gizlilik Politikası</a>
              <a href="/cerez-politikasi" className="font-semibold text-orange-700 hover:text-orange-800">Çerez Politikası</a>
              <a href="/kullanim-kosullari" className="font-semibold text-orange-700 hover:text-orange-800">Kullanım Koşulları</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
