import * as z from "zod";

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: "must be at least 4 characters long" })
      .max(16),
    email: z.string().min(4).email(),
    password: z
      .string()
      .min(4, { message: "must be at least 8 characters long" })
      .max(14),
    confirm: z
      .string()
      .min(4, { message: "must be at least 8 characters long" })
      .max(14),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const transactionSchema = z.object({
  amount: z.number({ error: () => ({ message: "Amount is required" }) }),
  payee: z.string({ error: () => ({ message: "Payee is required" }) }).min(1),
  notes: z.string().optional(),
  createdAt: z.string(),
  category: z.string(),
  accountId: z
    .string({ error: () => ({ message: "Account reference required" }) })
    .min(1),
  categoryId: z.string(),
});

export const Loginschema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(4, { message: "must be at least 8 characters long" })
    .max(24),
});
export const ProfileSchema = z.object({
  name: z.string().min(1).default(""),
  username: z.string().min(1).default(""),
  bio: z.string().min(1).default(""),
  imageUrl: z.string().min(1).default(""),
});
export const AccountSchema = z.object({
  name: z.string().max(15),
});
export const CategorySchema = z.object({
  name: z.string().max(15),
});
