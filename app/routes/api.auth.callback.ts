import { redirect } from "react-router";
import type { Route } from "./+types/api.auth.callback";
import { getTokenFromCode } from "../lib/gmail.server";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return redirect("/expenses?error=no_code");
  }

  if (!state) {
    return redirect("/expenses?error=no_state");
  }

  try {
    // Decode credentials from state parameter
    const credentials = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));

    const tokens = await getTokenFromCode(code, credentials);

    // In a real app, you'd store this in a session or database
    // For now, we'll redirect with the token in the URL (not secure for production!)
    return redirect(
      `/expenses?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token}`
    );
  } catch (error) {
    console.error("Error getting tokens:", error);
    return redirect("/expenses?error=auth_failed");
  }
}
