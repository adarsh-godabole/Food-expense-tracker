import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("expenses", "routes/expenses.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
  route("api/auth", "routes/api.auth.ts"),
  route("api/auth/callback", "routes/api.auth.callback.ts"),
  route("api/fetch-orders", "routes/api.fetch-orders.ts"),
] satisfies RouteConfig;
