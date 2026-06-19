type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  id_token?: string;
  scope?: string;
  token_type: string;
};

type GoogleUserInfo = {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
  email_verified?: boolean;
};

export function getGoogleOAuthConfig() {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback",
  };
}

export function buildGoogleAuthUrl() {
  const { clientId, redirectUri } = getGoogleOAuthConfig();

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID tanımlı değil.");
  }

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("access_type", "online");
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

export async function exchangeGoogleCode(code: string) {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthConfig();

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth yapılandırması eksik.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error("Google token değişimi başarısız oldu.");
  }

  return (await response.json()) as GoogleTokenResponse;
}

export async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Google kullanıcı bilgisi alınamadı.");
  }

  return (await response.json()) as GoogleUserInfo;
}
