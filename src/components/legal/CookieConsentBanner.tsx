import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { COOKIE_PREFERENCE_KEY } from "../../config/legal";

type CookiePreferences = {
  required: true;
  analytics: boolean;
  marketing: boolean;
};

const defaultPreferences: CookiePreferences = {
  required: true,
  analytics: false,
  marketing: false,
};

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const saved = window.localStorage.getItem(COOKIE_PREFERENCE_KEY);
    if (saved) {
      setVisible(false);
      return;
    }

    setVisible(true);
  }, []);

  const savePreferences = (next: CookiePreferences) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COOKIE_PREFERENCE_KEY, JSON.stringify(next));
    }
    setPreferences(next);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50">
      <div className="page-shell">
        <div className="surface-glass pointer-events-auto rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-orange-700">Çerez Tercihleri</p>
              <h3 className="mt-1 text-lg font-extrabold text-slate-900">KVKK uyumlu çerez yönetimi</h3>
              <p className="mt-2 text-sm text-slate-600">
                Zorunlu çerezler platformun çalışması için kullanılır. Analitik ve pazarlama çerezleri için tercihini özgürce belirleyebilirsin.
                <a href="/cerez-politikasi" className="ml-1 font-semibold text-orange-700 hover:text-orange-800">Çerez Politikası</a>
                <span className="mx-1">•</span>
                <a href="/kvkk-aydinlatma" className="font-semibold text-orange-700 hover:text-orange-800">KVKK Aydınlatma</a>
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(event) =>
                    setPreferences((current) => ({ ...current, analytics: event.target.checked }))
                  }
                />
                Analitik
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(event) =>
                    setPreferences((current) => ({ ...current, marketing: event.target.checked }))
                  }
                />
                Pazarlama
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => savePreferences(defaultPreferences)}>
              Sadece zorunlu
            </Button>
            <Button variant="secondary" size="sm" onClick={() => savePreferences(preferences)}>
              Seçimi kaydet
            </Button>
            <Button
              size="sm"
              onClick={() => savePreferences({ required: true, analytics: true, marketing: true })}
            >
              Tümünü kabul et
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
