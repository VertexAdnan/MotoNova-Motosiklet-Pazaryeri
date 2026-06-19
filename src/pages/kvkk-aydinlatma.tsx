import LegalPagesNav from "../components/legal/LegalPagesNav";

export const title = "KVKK Aydınlatma Metni";
export const description = "MotoNova KVKK aydınlatma metni ve veri işleme esasları.";

export default function KvkkPage() {
  return (
    <div className="page-shell py-10 sm:py-14">
      <LegalPagesNav />
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-soft sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">KVKK 6698</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">KVKK Aydınlatma Metni</h1>
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
          <p>MotoNova, veri sorumlusu sıfatıyla üyelik, ilan yayınlama, müşteri desteği ve güvenlik süreçleri kapsamında gerekli kişisel verileri işler.</p>
          <p>İşlenen başlıca veriler: kimlik/iletişim bilgileri, hesap bilgileri, ilan içerikleri, işlem kayıtları ve güvenlik loglarıdır.</p>
          <p>Veriler; sözleşmenin kurulması ve ifası, hukuki yükümlülüklerin yerine getirilmesi, dolandırıcılığın önlenmesi ve platform güvenliği amaçlarıyla işlenir.</p>
          <p>Kullanıcı, KVKK m.11 kapsamındaki başvuru haklarını platform üzerinden veya kayıtlı destek kanalları aracılığıyla kullanabilir.</p>
          <p className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-slate-700">
            Not: Bu metin ürün entegrasyonu için hazırlanmış örnek bir çerçevedir; yayına çıkmadan önce şirket unvanı, adres, saklama süreleri ve aktarım detayları hukuk danışmanı ile netleştirilmelidir.
          </p>
        </div>
      </div>
    </div>
  );
}
