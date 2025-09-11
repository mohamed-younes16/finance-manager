import * as z from "zod";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import prismadb from "@/lib/prismabd";
import getCurrentUser from "@/actions";
import { ProfileSchema, UserFetchedSchema } from "@/models/Schemas/Setup";

const patchProfileRoute = createRoute({
  method: "post",
  path: "patch",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ProfileSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: "Profile created/updated",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    400: {
      description: "Missing required fields",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

const getProfileRoute = createRoute({
  method: "get",
  path: "",
  responses: {
    200: {
      description: "Return the current user",
      content: {
        "application/json": {
          schema: z.object({
            user: UserFetchedSchema.nullable(),
          }),
        },
      },
    },
    401: {
      description: "user not found or unauthorized ",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

const profile = new OpenAPIHono()
  .openapi(patchProfileRoute, async (c) => {
    const data = c.req.valid("json");
    if (!data) return c.json({ message: "missing fields" }, 400);
    try {
      const user = await getCurrentUser();
      if (user) {
        await prismadb.user.upsert({
          create: { id: user.id, ...data, onboarded: true },
          update: { id: user.id, ...data, onboarded: true },
          where: { id: user.id },
        });
      } else {
        return c.json({ message: "Unauthorized" }, 401);
      }
      return c.json({ message: "your profile is ready" }, 201);
    } catch (error) {
      console.error(error);
      return c.json({ message: "error in server" }, 500);
    }
  })
  .openapi(getProfileRoute, async (c) => {
    const user = await getCurrentUser();
    if (!user) return c.json({ message: "Unauthorized" }, 401);
    return c.json({ user }, 200);
  });

export default profile;
