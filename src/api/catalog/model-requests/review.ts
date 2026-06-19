import { isAdminUser, listModelRequests, reviewModelRequest } from "../../helpers/catalog-service";
import { getUserById } from "../../helpers/user-store";

export default async function handler(req: Request) {
  if (!req.session) {
    return Response.json(
      { error: "Unauthorized", message: "Bu işlem için giriş yapmalısın." },
      { status: 401 }
    );
  }

  const reviewer = await getUserById(String(req.session.data.userId));
  if (!isAdminUser(reviewer?.email)) {
    return Response.json({ error: "Bu işlem için yetkin yok." }, { status: 403 });
  }

  if (req.method === "GET") {
    try {
      const status = req.query.status ? String(req.query.status) : undefined;
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
    try {
      const body = await req.json();
      const action = body.action === "reject" ? "reject" : "approve";

      const request = await reviewModelRequest({
        requestId: String(body.requestId || ""),
        reviewerUserId: String(req.session.data.userId),
        action,
        adminNotes: body.adminNotes ? String(body.adminNotes) : undefined,
      });

      return Response.json({
        success: true,
        message: action === "approve" ? "Model kataloga eklendi." : "Başvuru reddedildi.",
        request,
      });
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "Başvuru güncellenemedi." },
        { status: 400 }
      );
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
