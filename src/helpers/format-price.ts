export function formatPrice(value: number): string {
  return `${value.toLocaleString("tr-TR")} TL`;
}

export function parsePriceValue(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return Number(digits) || 0;
}

export function formatListingDate(date: Date): string {
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function maskPhone(phone?: string | null): string {
  if (!phone) {
    return "Telefon bilgisi yok";
  }

  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) {
    return phone;
  }

  return `${phone.slice(0, 3)} *** ** ${digits.slice(-2)}`;
}
