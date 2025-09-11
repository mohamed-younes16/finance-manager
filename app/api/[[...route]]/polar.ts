import { Hono } from "hono";
import { Checkout, CustomerPortal, Webhooks } from "@polar-sh/hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import prismadb from "@/lib/prismabd";
import getCurrentUser from "@/actions";
import { getUserSubscriptionPlan } from "@/lib/subscription";

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
    await Webhooks({
      webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
      onSubscriptionActive: async (sub) => {
        const {
          id: subscriptionId,
          metadata: { userId },
          currentPeriodEnd,
          productId,
          customerId,
        } = sub.data;

        await prismadb.user.update({
          where: { id: userId as string },
          data: {
            subscriptionId,
            currentPeriodEnd,
            productId,
            customerId,
          },
        });
      },
    })(c);
    return c.json({ pay: "payed with success " });
  })
  .get("/portal", async (c) => {
    const req = await CustomerPortal({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      server: "sandbox",
      getCustomerId: async () => {
        const user = await getCurrentUser();

        if (user && user.customerId) return user.customerId;
        else return "";
      },
    })(c);
    const url: string | null = req.headers.get("Location") || null;
    return c.json({ url });
  })
  .get("/", async (c) => {
    const planData = await getUserSubscriptionPlan();
    return c.json({ planData }, { status: 200 });
  });

export default polar;
