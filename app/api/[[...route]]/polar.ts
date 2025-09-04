import { Hono } from "hono";
import { Checkout, CustomerPortal, Webhooks } from "@polar-sh/hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import prismadb from "@/lib/prismabd";
import { Polar } from "@polar-sh/sdk";
import getCurrentUser from "@/actions";
import { PolarSubscriptionActivePayload } from "@/index";

export type CreateCheckoutResponse = {
  checkoutURL: string;
};

export const polar = new Hono()
  .get(
    "/checkout",
    zValidator(
      "query",
      z.object({
        products: z.string().min(1),
        customerEmail: z.email().optional(),
        metadata: z.string().optional(),
        theme: z.enum(["light", "dark"]).optional(),
      })
    ),
    async (c) => {
      const { theme } = c.req.valid("query");
      const res = await Checkout({
        accessToken: process.env.POLAR_ACCESS_TOKEN!,
        successUrl: process.env.SUCCESS_URL!,
        server: "sandbox",
        theme: theme ? theme : "dark",
      })(c);

      const location = res.headers.get("Location");

      return c.json({ checkoutURL: location });
    }
  )
  .post("/webhooks", async (c) => {
    const res = await Webhooks({
      webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
      onSubscriptionActive: async (sub: PolarSubscriptionActivePayload) => {
        const {
          id: subscriptionId,
          metadata: { userId },
          currentPeriodEnd,
          productId,
          customerId,
        } = sub.data;

        await prismadb.user.update({
          where: { id: userId },
          data: {
            subscriptionId,
            currentPeriodEnd,
            productId,
            customerId,
          },
        });
      },
    })(c);
    return c.json({ pay: "pay____________________________________" });
  })
  .get("/portal", async (c) => {
    const req = await CustomerPortal({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      server: "sandbox",
      getCustomerId: async (event) => {
        const user = await getCurrentUser();

        if (user && user.customerId) return user.customerId;
        else return "";
      },
    })(c);
    const url: string | null = req.headers.get("Location") || null;
    return c.json({ url });
  });

export default polar;
