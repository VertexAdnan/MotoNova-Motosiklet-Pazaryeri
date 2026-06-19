import { changeUserPassword } from "../../helpers/user-store";

/**
 * Change Password API
 * POST /api/auth/change-password
 */
export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!req.session) {
    return Response.json(
      { error: "Unauthorized", message: "Login gerekli" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");

    if (!currentPassword || !newPassword) {
      return Response.json(
        { error: "Mevcut şifre ve yeni şifre zorunludur." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return Response.json(
        { error: "Yeni şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const userId = String(req.session.data.userId || "");
    await changeUserPassword(userId, currentPassword, newPassword);

    return Response.json({
      success: true,
      message: "Şifren başarıyla güncellendi.",
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Şifre güncellenemedi." },
      { status: 400 }
    );
  }
}
