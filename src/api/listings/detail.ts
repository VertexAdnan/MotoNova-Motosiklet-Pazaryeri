import { getListingDetail, listSimilarListings } from "../../helpers/listings-service";

export default async function handler(req: Request) {
  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const id = String(req.query.id || req.query.ilan || "").trim();

  if (!id) {
    return Response.json({ error: "İlan kimliği gerekli." }, { status: 400 });
  }

  try {
    const listing = await getListingDetail(id);

    if (!listing) {
      return Response.json({ error: "İlan bulunamadı." }, { status: 404 });
    }

    const similar = await listSimilarListings(listing.id, listing.brand);

    return Response.json({ success: true, listing, similar });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "İlan detayı yüklenemedi." },
      { status: 500 }
    );
  }
}
