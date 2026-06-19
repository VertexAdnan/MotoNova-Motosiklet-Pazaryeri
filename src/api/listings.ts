import {
  countPublishedListings,
  createListing,
  listPublishedListings,
} from "../helpers/listings-service";
import { parsePriceValue } from "../helpers/format-price";

export default async function handler(req: Request) {
  if (req.method === "GET") {
    try {
      const featured = req.query.featured === "true";
      const limit = req.query.limit ? Number(req.query.limit) : undefined;

      const [listings, total] = await Promise.all([
        listPublishedListings({
          featured: featured || undefined,
          limit: Number.isFinite(limit) ? limit : undefined,
        }),
        countPublishedListings(),
      ]);

      return Response.json({ success: true, listings, total });
    } catch (error) {
      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "İlanlar yüklenemedi.",
        },
        { status: 500 }
      );
    }
  }

  if (req.method === "POST") {
    if (!req.session) {
      return Response.json(
        { error: "Unauthorized", message: "İlan vermek için giriş yapmalısın." },
        { status: 401 }
      );
    }

    try {
      const body = await req.json();
      const priceValue = parsePriceValue(String(body.priceValue || body.price || ""));

      if (!body.title || !body.brand || !body.city || !priceValue) {
        return Response.json(
          { error: "Başlık, marka, şehir ve geçerli bir fiyat zorunludur." },
          { status: 400 }
        );
      }

      if (!Array.isArray(body.images) || body.images.length === 0) {
        return Response.json({ error: "En az bir görsel yüklemelisin." }, { status: 400 });
      }

      const listing = await createListing(String(req.session.data.userId), {
        title: String(body.title),
        brand: String(body.brand),
        model: body.model ? String(body.model) : undefined,
        city: String(body.city),
        district: body.district ? String(body.district) : undefined,
        motorType: String(body.motorType || "Naked"),
        conditionType: String(body.conditionType || "İkinci El"),
        damageState: String(body.damageState || "Hasarsız"),
        timingType: String(body.timingType || "4 Zamanlı"),
        transmission: String(body.transmission || "Manuel"),
        fuelType: body.fuelType ? String(body.fuelType) : undefined,
        color: String(body.color || "Siyah"),
        origin: String(body.origin || "Türkiye"),
        year: Number(body.year) || new Date().getFullYear(),
        km: body.km ? Number(body.km) : undefined,
        engineCc: Number(body.engineCc) || 125,
        priceValue,
        description: body.description ? String(body.description) : undefined,
        images: body.images.map(String),
        status: body.status === "draft" ? "draft" : "published",
        featured: Boolean(body.featured),
      });

      return Response.json({ success: true, listing }, { status: 201 });
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "İlan oluşturulamadı." },
        { status: 500 }
      );
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
