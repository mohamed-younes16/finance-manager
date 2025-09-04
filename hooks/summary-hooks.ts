"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

type UseGetSummaryOptions = {
  from?: string;
  to?: string;
  accountId?: string;
};

export const useGetsummary = (options: UseGetSummaryOptions = {}) => {
  const { from = "", to = "", accountId = "" } = options;

  const query = useQuery({
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: { from, to, accountId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      return await response.json();
    },
  });

  return query;
};
