import { OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import prismadb from "@/lib/prismabd";
import getCurrentUser from "@/actions";
import { AccountSchema } from "@/models/Schemas/Setup";
import { createRoute } from "@hono/zod-openapi";

// Schema for account responses
const AccountResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  balance: z.number().optional(),
  currency: z.string().optional(),
});

// List all accounts
const listAccountsRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "List of user's accounts",
      content: {
        "application/json": {
          schema: z.object({
            accounts: z.array(AccountResponseSchema),
          }),
        },
      },
    },
    500: {
      description: "Internal server error",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

const getAccountRoute = createRoute({
  method: "get",
  path: "/{id}",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Account details",
      content: {
        "application/json": {
          schema: z.object({
            account: AccountResponseSchema,
          }),
        },
      },
    },
    400: {
      description: "Invalid ID format",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    404: {
      description: "Account not found",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

const createAccountRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: AccountSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Account created successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            account: AccountResponseSchema,
          }),
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

const updateAccountRoute = createRoute({
  method: "post",
  path: "/patch",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string().min(1, "Name is required"),
            id: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Account updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            account: AccountResponseSchema,
          }),
        },
      },
    },
    404: {
      description: "Account not found",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    400: {
      description: "server error",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

const deleteAccountsRoute = createRoute({
  method: "post",
  path: "/delete",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            ids: z.array(z.string()),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Accounts deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            count: z.number(),
          }),
        },
      },
    },
    400: {
      description: "No account IDs provided",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

const accounts = new OpenAPIHono()
  .openapi(listAccountsRoute, async (c) => {
    try {
      const user = await getCurrentUser();
      const accounts = await prismadb.financeAccount.findMany({
        where: { ownerId: user!.id },
        orderBy: { createdAt: "desc" },
      });
      return c.json({ accounts }, 200);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return c.json({ message: "Error fetching accounts" }, 500);
    }
  })
  .openapi(getAccountRoute, async (c) => {
    try {
      const user = await getCurrentUser();
      const { id } = c.req.valid("param");

      const account = await prismadb.financeAccount.findFirst({
        where: { id, ownerId: user!.id },
      });

      if (!account) {
        return c.json({ message: "Account not found" }, 404);
      }

      return c.json({ account }, 200);
    } catch (error) {
      console.error("Error fetching account:", error);
      return c.json({ message: "Error fetching account" }, 400);
    }
  })
  .openapi(createAccountRoute, async (c) => {
    try {
      const user = await getCurrentUser();
      const data = c.req.valid("json");

      const account = await prismadb.financeAccount.create({
        data: {
          ...data,
          owner: { connect: { id: user!.id } },
        },
      });

      return c.json(
        {
          message: "Account created successfully",
          account,
        },
        201
      );
    } catch (error) {
      console.error("Error creating account:", error);
      return c.json({ message: "Error creating account" }, 400);
    }
  })
  .openapi(updateAccountRoute, async (c) => {
    try {
      const user = await getCurrentUser();

      const { name, id } = c.req.valid("json");

      const account = await prismadb.financeAccount.update({
        where: { id, ownerId: user!.id },
        data: { name },
      });

      if (!account) {
        return c.json({ message: "Account not found" }, 404);
      }
      return c.json(
        {
          message: "Account updated successfully",
          account,
        },
        200
      );
    } catch (error) {
      console.error("Error updating account:", error);
      return c.json({ message: "Error updating account" }, 400);
    }
  })
  .openapi(deleteAccountsRoute, async (c) => {
    try {
      const user = await getCurrentUser();
      const { ids } = c.req.valid("json");
      console.log(ids);
      if (!ids.length) {
        return c.json({ message: "No account IDs provided" }, 400);
      }

      const { count } = await prismadb.financeAccount.deleteMany({
        where: {
          id: { in: ids },
          ownerId: user!.id,
        },
      });

      return c.json({
        message: `${count} account(s) deleted successfully`,
        count,
      });
    } catch (error) {
      console.error("Error deleting accounts:", error);
      return c.json({ message: "Error deleting accounts" }, 400);
    }
  });

export default accounts;
