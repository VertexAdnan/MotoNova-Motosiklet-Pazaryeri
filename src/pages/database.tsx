import { FormEvent, useEffect, useState } from "react";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";
import StatusBadge from "../components/dashboard/StatusBadge";

export const title = "Panelim";
export const description = "MotoNova kullanıcı paneli: ilan yönetimi, favoriler, güven puanı ve hızlı aksiyonlar.";

type DashboardListing = {
  id: string;
  title: string;
  status: "Yayında" | "İncelemede" | "Satıldı" | "Taslak";
  price: string;
  views: number;
  messages: number;
};

type ProfileUser = {
  fullName: string;
  username?: string;
  sellerType: string;
  email?: string;
  phone?: string;
  provider?: string;
};

type CatalogRequest = {
  id: string;
  brandName: string;
  modelName: string;
  yearFrom?: number | null;
  notes?: string | null;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [myListings, setMyListings] = useState<DashboardListing[]>([]);
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [catalogRequests, setCatalogRequests] = useState<CatalogRequest[]>([]);
  const [isCatalogAdmin, setIsCatalogAdmin] = useState(false);
  const [catalogNotice, setCatalogNotice] = useState("");
  const [reviewingRequestId, setReviewingRequestId] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    sellerType: "bireysel" as "bireysel" | "kurumsal",
  });
  const [profileNotice, setProfileNotice] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordNotice, setPasswordNotice] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch("/api/listings/mine", { credentials: "include" }),
      fetch("/api/auth/profile", { credentials: "include" }),
    ])
      .then(async ([listingsResponse, profileResponse]) => {
        const listingsData = await listingsResponse.json();
        const profileData = await profileResponse.json();

        if (!listingsResponse.ok) {
          throw new Error(listingsData.message || listingsData.error || "İlanlar yüklenemedi.");
        }

        if (!cancelled) {
          setMyListings(listingsData.listings || []);
          const nextProfile = profileResponse.ok ? profileData.user : null;
          setProfile(nextProfile);
          if (nextProfile) {
            setProfileForm({
              fullName: nextProfile.fullName || "",
              username: nextProfile.username || "",
              email: nextProfile.email || "",
              phone: nextProfile.phone || "",
              sellerType: nextProfile.sellerType === "kurumsal" ? "kurumsal" : "bireysel",
            });
          }
          setLoadError("");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setMyListings([]);
          setProfile(null);
          setLoadError(error instanceof Error ? error.message : "Panel verileri yüklenemedi.");
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

  useEffect(() => {
    let cancelled = false;

    fetch("/api/catalog/model-requests?status=pending", { credentials: "include" })
      .then(async (response) => {
        const data = await response.json();
        if (!cancelled && response.ok) {
          setIsCatalogAdmin(true);
          setCatalogRequests(data.requests || []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsCatalogAdmin(false);
          setCatalogRequests([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleReviewRequest = async (requestId: string, action: "approve" | "reject") => {
    setReviewingRequestId(requestId);
    setCatalogNotice("");

    try {
      const response = await fetch("/api/catalog/model-requests/review", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Başvuru güncellenemedi.");
      }

      setCatalogRequests((current) => current.filter((item) => item.id !== requestId));
      setCatalogNotice(action === "approve" ? "Model kataloga eklendi." : "Başvuru reddedildi.");
    } catch (error) {
      setCatalogNotice(error instanceof Error ? error.message : "Başvuru güncellenemedi.");
    } finally {
      setReviewingRequestId("");
    }
  };

  const isGoogleAccount = profile?.provider === "google";

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileNotice("");
    setProfileError("");
    setIsSavingProfile(true);

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Profil güncellenemedi.");
      }

      setProfile(data.user);
      setProfileForm({
        fullName: data.user.fullName || "",
        username: data.user.username || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        sellerType: data.user.sellerType === "kurumsal" ? "kurumsal" : "bireysel",
      });
      setProfileNotice(data.message || "Profil bilgilerin güncellendi.");
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "Profil güncellenemedi.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordNotice("");
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Yeni şifreler birbiriyle eşleşmiyor.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }

    setIsSavingPassword(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Şifre güncellenemedi.");
      }

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordNotice(data.message || "Şifren başarıyla güncellendi.");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Şifre güncellenemedi.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const publishedCount = myListings.filter((item) => item.status === "Yayında").length;
  const pendingCount = myListings.filter((item) => item.status === "İncelemede").length;
  const totalViews = myListings.reduce((sum, item) => sum + item.views, 0);

  const stats = [
    { label: "Aktif ilan", value: String(publishedCount), detail: pendingCount > 0 ? `${pendingCount} incelemede` : "Güncel" },
    { label: "Toplam görüntülenme", value: totalViews.toLocaleString("tr-TR"), detail: "Tüm ilanların" },
    { label: "Toplam ilan", value: String(myListings.length), detail: "Panelindeki kayıtlar" },
    { label: "Yeni mesaj", value: "0", detail: "Mesajlaşma yakında" },
  ];

  if (isLoading) {
    return (
      <div className="page-shell py-10 sm:py-14">
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-8 shadow-soft">
          <div className="skeleton-shimmer h-8 w-1/3 rounded-md" />
          <div className="mt-4 skeleton-shimmer h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page-shell py-10 sm:py-14">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-soft">
          <p className="text-lg font-bold text-slate-900">{loadError}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a href="/giris">
              <Button>Giriş Yap</Button>
            </a>
            <a href="/kayit-ol">
              <Button variant="outline">Kayıt Ol</Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-10 sm:py-14">
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">Kullanıcı Paneli</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">Panelim</h1>
            <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
              İlanlarını yönet, mesajlarını takip et, favorilerini incele ve güvenli satış sürecini tek merkezden kontrol et.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href="/ilan-ver"><Button>Yeni İlan Ver</Button></a>
            <a href="/ilanlar"><Button variant="outline">İlanları İncele</Button></a>
          </div>
        </div>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{item.value}</p>
            <p className="mt-1 text-xs text-slate-500">{item.detail}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">İlan Yönetimi</h2>
              <p className="mt-1 text-sm text-slate-600">Yayındaki, satılan ve incelemedeki ilanlarını buradan yönet.</p>
            </div>
            <a href="/ilan-ver" className="text-sm font-semibold text-orange-700 hover:text-orange-800">Yeni ilan</a>
          </div>

          <div className="space-y-3">
            {myListings.length > 0 ? (
              myListings.map((listing) => (
                <div key={listing.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-200">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">#{listing.id}</p>
                      <h3 className="mt-1 text-lg font-extrabold text-slate-900">{listing.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-orange-700">{listing.price}</p>
                    </div>
                    <StatusBadge status={listing.status} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span>{listing.views} görüntülenme</span>
                    <span>{listing.messages} mesaj</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">Düzenle</Button>
                    <Button variant="secondary" size="sm">Öne Çıkar</Button>
                    <Button variant="outline" size="sm">Sil</Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <p className="font-bold text-slate-900">Henüz ilan yok</p>
                <p className="mt-2 text-sm text-slate-600">İlk ilanını oluşturarak satışa başlayabilirsin.</p>
                <div className="mt-4">
                  <a href="/ilan-ver">
                    <Button size="sm">İlan Ver</Button>
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <h3 className="text-base font-extrabold text-slate-900">Profil Bilgileri</h3>
            <p className="mt-1 text-sm text-slate-600">Hesap bilgilerini buradan güncelleyebilirsin.</p>

            {profileNotice ? (
              <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {profileNotice}
              </p>
            ) : null}

            {profileError ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {profileError}
              </p>
            ) : null}

            <form className="mt-4 space-y-4" onSubmit={handleProfileSubmit}>
              <FormInput
                id="profile-full-name"
                label="Ad Soyad"
                value={profileForm.fullName}
                onChange={(event) => setProfileForm((current) => ({ ...current, fullName: event.target.value }))}
                required
              />

              <FormInput
                id="profile-username"
                label="Kullanıcı Adı"
                value={profileForm.username}
                onChange={(event) => setProfileForm((current) => ({ ...current, username: event.target.value }))}
                required
              />

              <FormInput
                id="profile-email"
                label="E-posta"
                type="email"
                value={profileForm.email}
                onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                required
              />

              <FormInput
                id="profile-phone"
                label="Telefon"
                type="tel"
                value={profileForm.phone}
                onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
                hint="Opsiyonel"
              />

              <div>
                <span className="search-label">Satıcı Tipi</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["bireysel", "kurumsal"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProfileForm((current) => ({ ...current, sellerType: type }))}
                      className={`rounded-pill px-4 py-2 text-sm font-semibold transition ${
                        profileForm.sellerType === type
                          ? "bg-brand-primary text-white shadow-soft"
                          : "border border-slate-300 bg-white text-slate-700 hover:border-orange-300"
                      }`}
                    >
                      {type === "kurumsal" ? "Kurumsal" : "Bireysel"}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSavingProfile}>
                {isSavingProfile ? "Kaydediliyor..." : "Profili Kaydet"}
              </Button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <h3 className="text-base font-extrabold text-slate-900">Şifre Değiştir</h3>
            <p className="mt-1 text-sm text-slate-600">
              {isGoogleAccount
                ? "Google ile giriş yaptığın için bu hesapta şifre değiştirme kullanılamaz."
                : "Güvenliğin için mevcut şifreni doğrulaman gerekir."}
            </p>

            {passwordNotice ? (
              <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {passwordNotice}
              </p>
            ) : null}

            {passwordError ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {passwordError}
              </p>
            ) : null}

            {!isGoogleAccount ? (
              <form className="mt-4 space-y-4" onSubmit={handlePasswordSubmit}>
                <FormInput
                  id="current-password"
                  label="Mevcut Şifre"
                  type="password"
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))
                  }
                  required
                />

                <FormInput
                  id="new-password"
                  label="Yeni Şifre"
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))
                  }
                  hint="En az 6 karakter"
                  required
                />

                <FormInput
                  id="confirm-password"
                  label="Yeni Şifre (Tekrar)"
                  type="password"
                  autoComplete="new-password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))
                  }
                  required
                />

                <Button type="submit" variant="secondary" className="w-full" disabled={isSavingPassword}>
                  {isSavingPassword ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                </Button>
              </form>
            ) : null}
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-soft">
            <h3 className="text-base font-extrabold text-slate-900">Hızlı İşlemler</h3>
            <div className="mt-3 flex flex-col gap-2">
              <a href="/ilan-ver" className="font-semibold text-orange-700 hover:text-orange-800">Yeni ilan oluştur</a>
              <a href="/gizlilik-politikasi" className="font-semibold text-orange-700 hover:text-orange-800">Hesap gizliliği</a>
              <a href="/kullanim-kosullari" className="font-semibold text-orange-700 hover:text-orange-800">Satış kuralları</a>
            </div>
          </div>
        </aside>
      </div>

      {isCatalogAdmin ? (
        <section className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Katalog Başvuruları</h2>
            <p className="mt-1 text-sm text-slate-600">
              Kullanıcıların &quot;Motorum listede yok&quot; başvurularını inceleyip kataloga ekleyebilirsin.
            </p>
          </div>

          {catalogNotice ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {catalogNotice}
            </p>
          ) : null}

          <div className="space-y-3">
            {catalogRequests.length > 0 ? (
              catalogRequests.map((request) => (
                <div key={request.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">#{request.id}</p>
                      <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                        {request.brandName} {request.modelName}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {request.yearFrom ? `Yıl: ${request.yearFrom} • ` : ""}
                        {new Date(request.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                      {request.notes ? (
                        <p className="mt-2 text-sm text-slate-600">{request.notes}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        disabled={reviewingRequestId === request.id}
                        onClick={() => handleReviewRequest(request.id, "approve")}
                      >
                        Onayla
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={reviewingRequestId === request.id}
                        onClick={() => handleReviewRequest(request.id, "reject")}
                      >
                        Reddet
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-600">
                Bekleyen katalog başvurusu yok.
              </div>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
