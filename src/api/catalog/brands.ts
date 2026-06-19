import { listCatalogBrands } from "../helpers/catalog-service";

export default async function handler(req: Request) {
  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const brands = await listCatalogBrands();
    return Response.json({ success: true, brands });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Markalar yüklenemedi." },
      { status: 500 }
    );
  }
}
