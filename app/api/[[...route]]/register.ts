import { Hono } from "hono";
import { z } from "zod";

import prismadb from "@/lib/prismabd";
import bcrypt from "bcryptjs";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { RegisterSchema } from "@/models/Schemas/Setup";

const schema = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string(),
});

const registerRoute = createRoute({
  method: "post",
  path: "",
  request: {
    body: {
      content: {
        "application/json": {
          schema: schema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: "User registered",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

const register = new OpenAPIHono().openapi(registerRoute, async (c) => {
  const { email, name, password } = c.req.valid("json");
  try {
    const hashedpassword = await bcrypt.hash(password, 12);

    const userupsert = await prismadb.user.create({
      data: { email, hashedpassword, name },
    });
    return c.json({ message: "User created is ready", userupsert }, 201);
  } catch (error) {
    console.log(error, "##########user create ###############");
    return c.json({ message: "error in server" }, 400);
  }
});

export default register;
