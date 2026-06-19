import { buildGoogleAuthUrl, getGoogleOAuthConfig } from "../../../helpers/google-oauth";

export default function handler(req: Request) {
  if (req.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { clientId, clientSecret } = getGoogleOAuthConfig();

  if (!clientId || !clientSecret) {
    return new Response(
      `Google OAuth ayarları eksik. .env dosyasına GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET eklemelisin.`,
      { status: 500 }
    );
  }

  return Response.redirect(buildGoogleAuthUrl(), 302);
}
