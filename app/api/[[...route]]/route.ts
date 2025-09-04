import { Hono } from "hono";
import { handle } from "hono/vercel";
import register from "./register";
import profile from "./profile";
import { getSession } from "@/actions";
import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";
import summary from "./summary";
import purchase from "./purchase";
import webhook from "./webhook";
import { OpenAPIHono } from "@hono/zod-openapi";
import { polar } from "./polar";
import chargily from "./chargily";

export const checkAuth = async (c, next) => {
  const session = await getSession();

  if (!session) {
    return c.json({ message: "Unauthorized " }, { status: 401 });
  }
  await next();
};

export const app = new OpenAPIHono().basePath("/api");

app.use("/*", async (c, next) => {
  if (
    c.req.path.startsWith("/api/webhook") ||
    c.req.path.startsWith("/api/polar") ||
    c.req.path.startsWith("/api/chargily")
  )
    return next();

  console.log("running check", c.req.path);
  await checkAuth(c, next);
});
app.notFound((c) => {
  return c.json({ page: "wrong" });
});
// app.onError((c) => {return c.message});
const routes = app
  .route("/register", register)
  .route("/profile", profile)
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary)
  .route("/purchase", purchase)
  .route("/webhook", webhook)
  .route("/polar", polar)
  .route("/chargily", chargily);
export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
