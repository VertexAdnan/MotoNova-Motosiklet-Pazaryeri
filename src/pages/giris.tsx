import { FormEvent, useState } from "react";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import FormInput from "../components/ui/FormInput";

export const title = "Giriş Yap";
export const description = "MotoNova hesabına giriş yap, favorilerini ve ilanlarını yönet.";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Giriş sırasında bir hata oluştu.");
        return;
      }

      setSuccess("Giriş başarılı, yönlendiriliyorsun...");
      setTimeout(() => {
        window.location.href = "/ilanlar";
      }, 700);
    } catch {
      setError("Sunucuya ulaşılamadı. Lütfen tekrar dene.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Hesabına giriş yap"
      title="MotoNova topluluğuna yeniden hoş geldin"
      description="Favorilerini görüntülemek, ilan vermek ve satıcı paneline erişmek için hesabına giriş yap."
      footer={
        <p className="text-sm text-slate-600">
          Hesabın yok mu? <a href="/kayit-ol" className="font-semibold text-orange-700 hover:text-orange-800">Kayıt ol</a>
        </p>
      }
    >
      <div className="space-y-3">
        <a href="/api/auth/google" className="flex h-11 items-center justify-center gap-3 rounded-pill border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700">
          <span className="text-base">G</span>
          Google ile giriş yap
        </a>

        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          veya
          <span className="h-px flex-1 bg-slate-200" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="identifier"
          label="Kullanıcı adı veya e-posta"
          placeholder="Kullanıcı adın veya e-posta adresin"
          value={identifier}
          onChange={(event) => setIdentifier(event.target.value)}
          required
        />

        <FormInput
          id="password"
          label="Şifre"
          type="password"
          placeholder="Şifreni gir"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        {success ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <a href="/kullanim-kosullari" className="text-sm font-semibold text-slate-500 hover:text-slate-800">
            Kullanım koşullarını incele
          </a>
          <Button type="submit" size="lg" className="min-w-44" disabled={isSubmitting}>
            {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}
