const legalNavLinks = [
  { label: "KVKK", href: "/kvkk-aydinlatma" },
  { label: "Gizlilik", href: "/gizlilik-politikasi" },
  { label: "Çerezler", href: "/cerez-politikasi" },
  { label: "Koşullar", href: "/kullanim-kosullari" },
];

export default function LegalPagesNav() {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {legalNavLinks.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="category-chip"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
