export const COOKIE_PREFERENCE_KEY = "motonova_cookie_preferences";

export const legalContact = {
  platformName: "MotoNova",
  supportEmail: "destek@motonova.example",
  kvkkEmail: "kvkk@motonova.example",
  address: "İstanbul, Türkiye",
};

export const mandatoryListingConsents = [
  {
    id: "accuracy",
    required: true,
    label:
      "İlana girilen bilgilerin doğru olduğunu, motosiklet üzerinde satışa engel hukuki bir kısıt bulunmadığını beyan ediyorum.",
  },
  {
    id: "age_and_authority",
    required: true,
    label:
      "18 yaşından büyük olduğumu ve ilanı verme yetkisine sahip olduğumu kabul ediyorum.",
  },
  {
    id: "terms_and_kvkk",
    required: true,
    label:
      "Kullanım Koşulları, KVKK Aydınlatma Metni ve Gizlilik Politikasını okudum, anladım.",
  },
  {
    id: "commercial_message",
    required: false,
    label:
      "Kampanya ve bilgilendirme amaçlı ticari elektronik ileti almak istiyorum.",
  },
] as const;

export const legalHighlightsTR = [
  {
    title: "KVKK (6698)",
    description:
      "Kişisel veriler için aydınlatma metni, veri minimizasyonu, güvenlik ve başvuru kanalı zorunludur.",
  },
  {
    title: "E-Ticaret / ETK",
    description:
      "Pazarlama iletişimi için ayrı ve isteğe bağlı onay alınmalıdır; zorunlu onaylarla birleştirilmemelidir.",
  },
  {
    title: "İlan İçerik Sorumluluğu",
    description:
      "Yanıltıcı, hukuka aykırı veya sahte ilanlara karşı kullanıcı beyanı, raporlama ve moderasyon akışı bulunmalıdır.",
  },
  {
    title: "İkinci El Taşıt Ticareti",
    description:
      "Kurumsal satıcılar için yetki belgesi ve şirket bilgisi alanları desteklenmelidir.",
  },
] as const;
