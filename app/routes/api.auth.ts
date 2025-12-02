import { redirect } from "react-router";
import type { Route } from "./+types/api.auth";
import { getAuthUrl } from "../lib/gmail.server";

export async function loader({}: Route.LoaderArgs) {
  const authUrl = getAuthUrl();
  return redirect(authUrl);
}
