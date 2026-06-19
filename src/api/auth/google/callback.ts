import { sessionManager } from "../../../server";
import { findOrCreateGoogleUser } from "../../../helpers/user-store";
import { exchangeGoogleCode, fetchGoogleUserInfo, getGoogleOAuthConfig } from "../../../helpers/google-oauth";

export default async function handler(req: Request) {
  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return Response.redirect(`http://localhost:3000/giris?error=${encodeURIComponent("Google girişi iptal edildi.")}`, 302);
  }

  if (!code) {
    return Response.redirect(`http://localhost:3000/giris?error=${encodeURIComponent("Google doğrulama kodu alınamadı.")}`, 302);
  }

  try {
    const { redirectUri } = getGoogleOAuthConfig();
    const tokenResponse = await exchangeGoogleCode(code);
    const googleUser = await fetchGoogleUserInfo(tokenResponse.access_token);

    if (!googleUser.email) {
      throw new Error("Google hesabından e-posta bilgisi alınamadı.");
    }

    const user = await findOrCreateGoogleUser({
      email: googleUser.email,
      fullName: googleUser.name || googleUser.email.split("@")[0],
      avatarUrl: googleUser.picture,
    });

    const session = await sessionManager.create({
      userId: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      sellerType: user.sellerType,
      provider: "google",
      loginAt: Date.now(),
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: "http://localhost:3000/ilanlar",
        "Set-Cookie": sessionManager.createCookieHeader(session.id),
      },
    });
  } catch (oauthError) {
    const message = oauthError instanceof Error ? oauthError.message : "Google girişi başarısız oldu.";
    return Response.redirect(`http://localhost:3000/giris?error=${encodeURIComponent(message)}`, 302);
  }
}
