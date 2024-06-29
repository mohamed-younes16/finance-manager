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

const checkAuth = async (c, next) => {
  const session = await getSession();

  if (!session) {
    return c.json({ message: "Unauthorized " }, { status: 401 });
  }
  await next();
};

const app = new Hono().basePath("/api");

const routes = app
  .route("/register", register)
  .route("/profile", profile)
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)
  .route("/summary", summary)
  .route("/purchase", purchase)
  .route("/webhook", webhook);
export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
