import { sessionManager } from "../../server";

/**
 * Logout API
 * POST /api/auth/logout
 * 
 * Session'ı sonlandırır ve cookie'yi siler
 */
export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  if (req.session) {
    await sessionManager.destroy(req.session.id);
  }

  // Cookie'yi sil
  const deleteCookieHeader = sessionManager.createDeleteCookieHeader();

  return Response.json(
    {
      success: true,
      message: "Logout başarılı",
    },
    {
      headers: {
        "Set-Cookie": deleteCookieHeader,
      },
    }
  );
}
