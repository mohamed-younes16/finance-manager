import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),

  STRIPE_API_KEY: z.string().min(1),

  NEXT_PUBLIC_APP_URL: z.string().url(),

  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),

  NEXTAUTH_SECRET: z.string().min(1),
  SECRET: z.string().min(1),

  UPLOADTHING_SECRET: z.string().min(1),
  UPLOADTHING_APP_ID: z.string().min(1),

  LEMONSQUEEZY_API_KEY: z.string().min(1),
  LEMON_SQUEEZY_STORE_ID: z.string().min(1),
  LEMONS_SQUEEZY_PRODUCT_ID: z.string().min(1),
  LEMONS_SQUEEZY_SIGNATURE: z.string().min(1),

  POLAR_ACCESS_TOKEN: z.string().min(1),
  POLAR_SUCCESS_URL: z.url(),
  NEXT_PUBLIC_POLAR_PRODUCT_ID: z.uuid(),
  POLAR_WEBHOOK_SECRET: z.string().min(1),

  CHARGILY_API_KEY: z.string().min(1),
  CHARGILY_PRODUCT_ID: z.string().min(1),

  SLICK_API: z.string().min(1),
});

export const env = envSchema.parse(process.env);
