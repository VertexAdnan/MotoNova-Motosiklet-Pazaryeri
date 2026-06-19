import { sessionManager } from "../../server";
import { registerUser } from "../../helpers/user-store";

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const { fullName, username, email, password, phone, sellerType } = body;

    if (!fullName || !username || !email || !password) {
      return Response.json(
        { error: "Ad soyad, kullanıcı adı, e-posta ve şifre zorunludur." },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return Response.json(
        { error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    const user = await registerUser({
      fullName: String(fullName),
      username: String(username),
      email: String(email),
      password: String(password),
      phone: String(phone || ""),
      sellerType: sellerType === "kurumsal" ? "kurumsal" : "bireysel",
    });

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
        message: "Kayıt başarılı",
        user,
      },
      {
        headers: {
          "Set-Cookie": sessionManager.createCookieHeader(session.id),
        },
      }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Kayıt sırasında hata oluştu." },
      { status: 400 }
    );
  }
}
