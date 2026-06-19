import { createModelRequest, isAdminUser, listModelRequests } from "../../helpers/catalog-service";
import { getUserById } from "../../helpers/user-store";

export default async function handler(req: Request) {
  if (req.method === "GET") {
    if (!req.session) {
      return Response.json(
        { error: "Unauthorized", message: "Bu işlem için giriş yapmalısın." },
        { status: 401 }
      );
    }

    const user = await getUserById(String(req.session.data.userId));
    if (!isAdminUser(user?.email)) {
      return Response.json({ error: "Bu işlem için yetkin yok." }, { status: 403 });
    }

    try {
      const status = req.query.status ? String(req.query.status) : "pending";
      const requests = await listModelRequests(status);
      return Response.json({ success: true, requests });
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "Başvurular yüklenemedi." },
        { status: 500 }
      );
    }
  }

  if (req.method === "POST") {
    if (!req.session) {
      return Response.json(
        { error: "Unauthorized", message: "Başvuru için giriş yapmalısın." },
        { status: 401 }
      );
    }

    try {
      const body = await req.json();
      const request = await createModelRequest({
        userId: String(req.session.data.userId),
        brandName: String(body.brandName || ""),
        modelName: String(body.modelName || ""),
        yearFrom: body.yearFrom ? Number(body.yearFrom) : undefined,
        yearTo: body.yearTo ? Number(body.yearTo) : undefined,
        notes: body.notes ? String(body.notes) : undefined,
      });

      return Response.json(
        {
          success: true,
          message: "Başvurun alındı. İnceleme sonrası kataloga eklenecek.",
          request,
        },
        { status: 201 }
      );
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "Başvuru gönderilemedi." },
        { status: 400 }
      );
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
