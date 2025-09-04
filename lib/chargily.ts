import { ChargilyClient } from "@chargily/chargily-pay";

export const chargilyCli = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY!,
  mode: "test",
});
