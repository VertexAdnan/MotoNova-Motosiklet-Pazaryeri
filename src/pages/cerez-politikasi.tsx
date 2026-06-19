import LegalPagesNav from "../components/legal/LegalPagesNav";

export const title = "Çerez Politikası";
export const description = "MotoNova çerez politikası ve tercih yönetimi.";

export default function CookiePolicyPage() {
  return (
    <div className="page-shell py-10 sm:py-14">
      <LegalPagesNav />
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-soft sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">Çerezler</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Çerez Politikası</h1>
        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
          <p>Zorunlu çerezler oturum yönetimi, güvenlik ve temel sayfa işlevleri için kullanılır.</p>
          <p>Analitik ve pazarlama çerezleri, kullanıcının açık tercihi doğrultusunda etkinleşir ve tercih panelinden her zaman değiştirilebilir.</p>
          <p>Çerez tercihleri ilk ziyaret sırasında sorulur; kullanıcı sadece zorunlu çerezlerle devam etmeyi seçebilir.</p>
        </div>
      </div>
    </div>
  );
}
