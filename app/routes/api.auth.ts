import { redirect } from "react-router";
import type { Route } from "./+types/api.auth";
import { google } from "googleapis";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id");
  const clientSecret = url.searchParams.get("client_secret");
  const redirectUri = url.searchParams.get("redirect_uri");

  if (!clientId || !clientSecret || !redirectUri) {
    return redirect("/?error=missing_credentials");
  }

  // Encode credentials in state parameter to pass through OAuth flow
  const state = Buffer.from(
    JSON.stringify({ clientId, clientSecret, redirectUri })
  ).toString("base64");

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
    state,
  });

  return redirect(authUrl);
}
