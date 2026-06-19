import { listCatalogModels } from "../../helpers/catalog-service";

export default async function handler(req: Request) {
  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const brandId = String(req.query.brandId || "").trim();

  if (!brandId) {
    return Response.json({ error: "Marka kimliği gerekli." }, { status: 400 });
  }

  try {
    const models = await listCatalogModels(brandId);
    return Response.json({ success: true, models });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Modeller yüklenemedi." },
      { status: 500 }
    );
  }
}
