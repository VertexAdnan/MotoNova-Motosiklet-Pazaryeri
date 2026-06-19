import { sessionManager } from "../../server";
import { authenticateUser } from "../../helpers/user-store";

/**
 * Login API
 * POST /api/auth/login
 */
export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const identifier = String(body.identifier || body.username || body.email || "").trim();
    const password = String(body.password || "").trim();

    if (!identifier || !password) {
      return Response.json(
        { error: "Kullanıcı adı/e-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    const user = await authenticateUser(identifier, password);

    if (!user) {
      return Response.json(
        { error: "Kullanıcı adı veya şifre hatalı" },
        { status: 401 }
      );
    }

    const session = await sessionManager.create({
      userId: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      sellerType: user.sellerType,
      loginAt: Date.now(),
    });

    return Response.json(
      {
        success: true,
        message: "Giriş başarılı",
        user: {
          userId: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          sellerType: user.sellerType,
        },
      },
      {
        headers: {
          "Set-Cookie": sessionManager.createCookieHeader(session.id),
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Giriş sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
