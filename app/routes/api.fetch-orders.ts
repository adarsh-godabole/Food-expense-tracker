import type { Route } from "./+types/api.fetch-orders";
import { fetchOrderEmails, parseOrderEmail } from "../lib/gmail.server";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const accessToken = url.searchParams.get("access_token");

  if (!accessToken) {
    return Response.json({ error: "No access token provided" }, { status: 400 });
  }

  try {
    const emails = await fetchOrderEmails(accessToken);
    const orders = emails
      .map((email) => parseOrderEmail(email))
      .filter((order) => order !== null);

    return Response.json({ orders });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return Response.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
