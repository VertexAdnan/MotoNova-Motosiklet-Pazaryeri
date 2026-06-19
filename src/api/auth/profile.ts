import { sessionManager } from "../../server";
import { getUserById, updateUserProfile } from "../../helpers/user-store";

/**
 * Profile API
 * GET  /api/auth/profile  — Oturum açmış kullanıcının bilgileri
 * PATCH /api/auth/profile — Profil bilgilerini güncelle
 */
export default async function handler(req: Request) {
  if (!req.session) {
    return Response.json(
      { error: "Unauthorized", message: "Login gerekli" },
      { status: 401 }
    );
  }

  const userId = String(req.session.data.userId || "");

  if (req.method === "GET") {
    const user = await getUserById(userId);

    if (!user) {
      return Response.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    return Response.json({
      success: true,
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || "",
        sellerType: user.sellerType,
        provider: user.provider || "local",
        avatarUrl: user.avatarUrl || "",
        loginAt: req.session.data.loginAt,
      },
      session: {
        id: req.session.id,
        createdAt: req.session.createdAt,
        expiresAt: req.session.expiresAt,
      },
    });
  }

  if (req.method === "PATCH") {
    try {
      const body = await req.json();
      const user = await updateUserProfile(userId, {
        fullName: body.fullName !== undefined ? String(body.fullName) : undefined,
        username: body.username !== undefined ? String(body.username) : undefined,
        email: body.email !== undefined ? String(body.email) : undefined,
        phone: body.phone !== undefined ? String(body.phone) : undefined,
        sellerType:
          body.sellerType === "kurumsal" || body.sellerType === "bireysel"
            ? body.sellerType
            : undefined,
      });

      await sessionManager.update(req.session.id, {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        sellerType: user.sellerType,
      });

      return Response.json({
        success: true,
        message: "Profil bilgilerin güncellendi.",
        user: {
          userId: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone || "",
          sellerType: user.sellerType,
          provider: user.provider || "local",
          avatarUrl: user.avatarUrl || "",
        },
      });
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : "Profil güncellenemedi." },
        { status: 400 }
      );
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
