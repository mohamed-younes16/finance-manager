

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
export const Loginschema = z.object({
  email: z.string().min(4).email(),
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