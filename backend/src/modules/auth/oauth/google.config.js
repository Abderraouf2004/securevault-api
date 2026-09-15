import * as oidc from "openid-client";
const googleIssuer = new URL("https://accounts.google.com");
export async function getGoogleConfig() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        throw new Error("Google OAuth environment variables are missing");
    }
    return oidc.discovery(googleIssuer, clientId, clientSecret);
}
