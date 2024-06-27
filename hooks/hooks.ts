"use client";
import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useUser = () => {
  const query = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const res = await client.api.profile.$get();
      if (!res.ok) throw new Error("Failed to Fetch User");
      const { user } = await res.json();
      return user;
    },
  });
  return query;
};

