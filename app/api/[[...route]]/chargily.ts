import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import prismadb from "@/lib/prismabd";
import { chargilyCli } from "@/lib/chargily";
import { verifySignature } from "@chargily/chargily-pay";
import { Buffer } from "buffer";
import { ChargilyWebhook } from "@/index";

export const chargily = new Hono()
  .get(
    "/checkout",
    zValidator(
      "query",
      z.object({
        userId: z.string(),
        customerEmail: z.email(),
      })
    ),
    async (c) => {
      const { userId, customerEmail } = c.req.valid("query");

      const checkout = await chargilyCli.createCheckout({
        items: [
          {
            price: process.env.CHARGILY_PRODUCT_ID!,
            quantity: 1,
          },
        ],
        success_url: "http://localhost:3000",
        failure_url: "http://localhost:3000",
        payment_method: "edahabia",
        locale: "en",
        pass_fees_to_customer: true,
        metadata: {
          email: customerEmail,
          userId,
          productId: process.env.CHARGILY_PRODUCT_ID!,
        },
      });

      return c.json({ checkoutURL: checkout.checkout_url });
    }
  )
  .post("/webhooks", async (c) => {
    const buffer = Buffer.from(await c.req.raw.arrayBuffer());
    const Signature = c.req.raw.headers.get("signature") || "";

    if (
      !Signature ||
      !verifySignature(buffer, Signature, process.env.CHARGILY_API_KEY!)
    )
      return c.json({ error: "unauthorized" }, { status: 401 });
    const data: ChargilyWebhook = JSON.parse(buffer.toString());
    const {
      id,
      data: {
        metadata: { userId, email, productId },
        customer_id: customerId,
      },
      created_at,
    } = data;

    console.log(data);
    const user = await prismadb.user.update({
      where: { id: userId, email },
      data: {
        subscriptionId: id,
        currentPeriodEnd: new Date(created_at * 1000),
        productId,
        customerId,
      },
    });
    console.log(user);
    return c.json({ pay: user });
  });

export default chargily;
