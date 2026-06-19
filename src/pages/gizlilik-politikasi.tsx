import LegalPagesNav from "../components/legal/LegalPagesNav";

export const title = "Gizlilik Politikası";
export const description = "MotoNova gizlilik politikası ve veri güvenliği yaklaşımı.";

export default function PrivacyPolicyPage() {
  return (
    <div className="page-shell py-10 sm:py-14">
      <LegalPagesNav />
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-soft sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">Gizlilik</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Gizlilik Politikası</h1>
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
          <p>MotoNova, kullanıcı verilerini yetkisiz erişime karşı korumak için erişim kontrolü, loglama, oturum güvenliği ve saklama politikaları uygular.</p>
          <p>Platform üzerinde paylaşılan ilan ve iletişim bilgilerinin yalnızca hizmet amacıyla kullanılması esastır; yetkisiz paylaşım ve kötüye kullanım yasaktır.</p>
          <p>Kişisel veriler yalnızca gerekli olduğu süre boyunca saklanır ve mevzuatın izin verdiği çerçevede imha edilir veya anonimleştirilir.</p>
        </div>
      </div>
    </div>
  );
}
