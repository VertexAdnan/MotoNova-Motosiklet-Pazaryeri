import { FormEvent, useMemo, useState } from "react";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";

export const title = "Kayıt Ol";
export const description = "MotoNova hesabını oluştur, favorilerini kaydet ve güvenli şekilde ilan ver.";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sellerType, setSellerType] = useState<"bireysel" | "kurumsal">("bireysel");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedKvkk, setAcceptedKvkk] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => acceptedTerms && acceptedKvkk && password.length >= 6 && password === confirmPassword,
    [acceptedKvkk, acceptedTerms, confirmPassword, password]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Şifreler birbiriyle eşleşmiyor.");
      return;
    }

    if (!acceptedTerms || !acceptedKvkk) {
      setError("Devam etmek için zorunlu onayları kabul etmelisin.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          username,
          email,
          phone,
          password,
          sellerType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Kayıt oluşturulamadı.");
        return;
      }

      setSuccess("Kayıt başarılı, hesabın oluşturuldu. Yönlendiriliyorsun...");
      setTimeout(() => {
        window.location.href = "/ilan-ver";
      }, 800);
    } catch {
      setError("Sunucuya ulaşılamadı. Lütfen tekrar dene.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Yeni hesap oluştur"
      title="MotoNova ile güvenli alım-satım deneyimine katıl"
      description="Bireysel ya da kurumsal satıcı hesabı açabilir, ilanlarını yönetebilir ve favori listen üzerinden doğru motoru takip edebilirsin."
      footer={
        <p className="text-sm text-slate-600">
          Zaten hesabın var mı? <a href="/giris" className="font-semibold text-orange-700 hover:text-orange-800">Giriş yap</a>
        </p>
      }
    >
      <div className="space-y-3">
        <a href="/api/auth/google" className="flex h-11 items-center justify-center gap-3 rounded-pill border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700">
          <span className="text-base">G</span>
          Google ile kayıt ol
        </a>

        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          veya
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput id="fullName" label="Ad Soyad" placeholder="Adın soyadın" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <FormInput id="username" label="Kullanıcı adı" placeholder="benzersiz kullanıcı adı" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <FormInput id="email" label="E-posta" type="email" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <FormInput id="phone" label="Telefon" placeholder="05xx xxx xx xx" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <FormInput id="password" label="Şifre" type="password" placeholder="En az 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <FormInput id="confirmPassword" label="Şifre Tekrar" type="password" placeholder="Şifreni tekrar gir" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required error={confirmPassword && password !== confirmPassword ? "Şifreler eşleşmiyor" : ""} />
        </div>

        <label className="block">
          <span className="search-label">Satıcı tipi</span>
          <select className="input-base" value={sellerType} onChange={(e) => setSellerType(e.target.value as "bireysel" | "kurumsal") }>
            <option value="bireysel">Bireysel</option>
            <option value="kurumsal">Kurumsal</option>
          </select>
        </label>

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <label className="flex items-start gap-3 text-sm text-slate-700">
            <input type="checkbox" className="mt-1" checked={acceptedKvkk} onChange={(e) => setAcceptedKvkk(e.target.checked)} />
            <span><a href="/kvkk-aydinlatma" className="font-semibold text-orange-700 hover:text-orange-800">KVKK Aydınlatma Metni</a> ve <a href="/gizlilik-politikasi" className="font-semibold text-orange-700 hover:text-orange-800">Gizlilik Politikası</a>nı okudum.</span>
          </label>
          <label className="flex items-start gap-3 text-sm text-slate-700">
            <input type="checkbox" className="mt-1" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
            <span><a href="/kullanim-kosullari" className="font-semibold text-orange-700 hover:text-orange-800">Kullanım Koşulları</a>nı kabul ediyorum.</span>
          </label>
        </div>

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {success ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="min-w-48" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Hesap oluşturuluyor..." : "Kayıt Ol"}
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}
