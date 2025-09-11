import { handle } from "hono/vercel";
import register from "./register";
import profile from "./profile";
import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";
import summary from "./summary";
import { OpenAPIHono } from "@hono/zod-openapi";
import { polar } from "./polar";
import { checkAuth } from "./middleware";
import configureOpenApi from "./lib/openApi";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _routes = app
  .route("/profile", profile)
  .route("/register", register)
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary)
  .route("/polar", polar);

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


export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof _routes;
