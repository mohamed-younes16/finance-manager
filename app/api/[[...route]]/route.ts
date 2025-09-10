import { handle } from "hono/vercel";
import register from "./register";
import profile from "./profile";
import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";
import summary from "./summary";
import purchase from "./purchase";
import webhook from "./webhook";
import { OpenAPIHono } from "@hono/zod-openapi";
import { polar } from "./polar";
import chargily from "./chargily";
import { checkAuth } from "./middleware";
import configureOpenApi from "./lib/openApi";
import { Scalar } from "@scalar/hono-api-reference";

export const app = new OpenAPIHono({ strict: false }).basePath("/api");

app.notFound((c) => {
  return c.json({ page: "wrong" });
});

app.onError((err, c) => {
  return c.json(
    {
      success: false,
      message: err.message || "Internal Server Error",
    },
    500
  );
});

const routes = app
  .route("/profile", profile)
  .route("/register", register)
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary)
  .route("/purchase", purchase)
  .route("/polar", polar)
  .route("/webhook", webhook)

app.use("/*", async (c, next) => {
  if (
    c.req.path.startsWith("/api/webhook") ||
    c.req.path.startsWith("/api/polar") ||
    c.req.path.startsWith("/api/chargily") ||
    c.req.path.startsWith("/api/doc")
  )
    return next();

  await checkAuth(c, next);
});

configureOpenApi(app);
app.get("/scalar", Scalar({ url: "/api/doc", theme: "deepSpace" }));

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
