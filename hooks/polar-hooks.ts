import { client } from "@/lib/hono";
import { UserFetched } from "@/models/Schemas/Setup";
import { useQuery } from "@tanstack/react-query";

export const usePolarCheckout = (
  user: UserFetched,
  theme: "light" | "dark" | undefined
) => {
  const query = useQuery({
    queryKey: ["payements"],
    queryFn: async () => {
      try {
        const res = await client.api.polar.checkout.$get({
          query: {
            products: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID!,
            metadata: JSON.stringify({ userId: user?.id, email: user?.email }),
            customerEmail: user?.email || undefined,
            theme,
          },
        });
        console.log("SHOULD RUN");
        return res.json();
      } catch (err) {
        console.error("Query error:", err);
        throw err;
      }
    },
    staleTime: 0,
  });
  return query;
};

export const usePolarPortal = () => {
  const query = useQuery({
    queryKey: ["portal"],
    queryFn: async () => {
      try {
        const res = await client.api.polar.portal.$get();
        console.log(res);
        return res.json();
      } catch (err) {
        console.error("Query error:", err);
        throw err;
      }
    },
    staleTime: 0,
  });
  return query;
};

export const useGetPlan = () => {
  const query = useQuery({
    queryKey: ["plan"],
    queryFn: async () => {
      const res = await client.api.polar.$get();

      if (!res.ok) throw new Error("Failed to Fetch accounts");

      const { planData } = await res.json();

      return planData;
    },
  });
  return query;
};
