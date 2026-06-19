import LegalPagesNav from "../components/legal/LegalPagesNav";

export const title = "Kullanım Koşulları";
export const description = "MotoNova kullanım koşulları ve ilan yayın kuralları.";

export default function TermsPage() {
  return (
    <div className="page-shell py-10 sm:py-14">
      <LegalPagesNav />
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-soft sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">Platform Kuralları</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Kullanım Koşulları</h1>
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
          <p>MotoNova, motosiklet ilanlarının yayınlanmasına aracılık eden bir platformdur; taraflar arasındaki satış sözleşmesinin doğrudan tarafı değildir.</p>
          <p>Kullanıcılar; hukuka aykırı, yanıltıcı, sahte, üçüncü kişi haklarını ihlal eden veya gerçeğe aykırı içerik yayınlayamaz.</p>
          <p>Kurumsal satıcılar, gerekli ticari ve sektörel yetki belgelerini doğru ve güncel şekilde sunmakla yükümlüdür.</p>
          <p>Platform; güvenlik, dolandırıcılık önleme ve mevzuata uyum amaçlarıyla ilanları askıya alma, ek doğrulama isteme veya kaldırma hakkını saklı tutar.</p>
        </div>
      </div>
    </div>
  );
}
