import { z } from "zod";
import type { infer as zInfer } from "zod";

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: "must be at least 4 characters long" })
      .max(16),
    email: z.email(),
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
  notes: z.string(),
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
  name: z.string(),
  username: z.string(),
  bio: z.string(),
  imageUrl: z.string(),
});
export const AccountSchema = z.object({
  name: z.string().max(15),
});
export const CategorySchema = z.object({
  name: z.string().max(15),
});

export const UserFetchedSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string(),
  username: z.string().nullable(),
  imageUrl: z.string().nullable(),
  bio: z.string().nullable(),
  customerId: z.string().nullable(),
  onboarded: z.boolean(),
});

export type UserFetched = zInfer<typeof UserFetchedSchema>;
export type transactionSchemaType = zInfer<typeof transactionSchema>;
export type RegisterSchemaType = zInfer<typeof RegisterSchema>;
export type LoginschemaType = zInfer<typeof Loginschema>;
export type ProfileSchemaType = zInfer<typeof ProfileSchema>;
export type AccountSchemaType = zInfer<typeof AccountSchema>;
export type CategorySchemaType = zInfer<typeof CategorySchema>;