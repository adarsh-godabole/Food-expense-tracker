import type { Route } from "./+types/api.refresh-token";
import { refreshAccessToken } from "../lib/gmail.server";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const refreshToken = url.searchParams.get("refresh_token");

  if (!refreshToken) {
    return Response.json({ error: "No refresh token provided" }, { status: 400 });
  }

  try {
    const tokens = await refreshAccessToken(refreshToken);

    return Response.json({
      access_token: tokens.access_token,
      expires_in: tokens.expiry_date
    });
  } catch (error: any) {
    console.error("Error refreshing token:", error);
    return Response.json(
      { error: error.message || "Failed to refresh token" },
      { status: 500 }
    );
  }
}
