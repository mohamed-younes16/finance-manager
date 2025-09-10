// import { client } from "@/lib/hono";
// import { UserFetched } from "@/models/Schemas/Setup";
// import { useQuery } from "@tanstack/react-query";

// export const usechargilyCheckout = (
//   user: UserFetched,
// ) => {
//   const query = useQuery({
//     queryKey: ["payements"],
//     queryFn: async () => {
//       try {
//         const res = await client.api.chargily.checkout.$get({
//           query: {
//             customerEmail: user.email,
//             userId: user.id,
//           },
//         });
    
//         return res.json();
//       } catch (err) {
//         console.error("Query error:", err);
//         throw err;
//       }
//     },
//     staleTime: 0,
//   });
//   return query;
// };
