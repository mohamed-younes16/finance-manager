import getCurrentUser from "@/actions";
import prismadb from "@/lib/prismabd";
import { transactionSchema } from "@/models/Schemas/Setup";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { parse, subDays } from "date-fns";
import * as z from "zod";

const getTransactionsRoute = createRoute({
  method: "get",
  path: "",
  request: {
    query: z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "List of transactions",
      content: {
        "application/json": {
          schema: z.object({
            transactions: z.array(
              z.object({
                id: z.string(),
                createdAt: z.string(),
                amount: z.number(),
                notes: z.string().nullable(),
                payee: z.string(),
                categoryRef: z
                  .object({
                    id: z.string(),
                    name: z.string(),
                  })
                  .nullable(),
                accountRef: z.object({
                  id: z.string(),
                  name: z.string(),
                }),
              })
            ),
          }),
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

const getTransactionByIdRoute = createRoute({
  method: "get",
  path: ":id",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Transaction details",
      content: {
        "application/json": {
          schema: z.object({
            transaction: z
              .object({
                id: z.string(),
                createdAt: z.string(),
                amount: z.number(),
                notes: z.string().nullable(),
                payee: z.string(),
                categoryRef: z
                  .object({
                    id: z.string(),
                    name: z.string(),
                  })
                  .nullable(),
                accountRef: z.object({
                  id: z.string(),
                  name: z.string(),
                }),
              })
              .nullable(),
          }),
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

const createTransactionRoute = createRoute({
  method: "post",
  path: "",
  request: {
    body: {
      content: {
        "application/json": {
          schema: transactionSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: "Transaction created",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
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

const patchTransactionRoute = createRoute({
  method: "post",
  path: "/patch",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.intersection(
            transactionSchema,
            z.object({ id: z.string() })
          ),
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: "Transaction updated",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
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
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

const deleteTransactionsRoute = createRoute({
  method: "post",
  path: "delete",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            ids: z.array(z.string()),
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: "Transactions deleted",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
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

const transactions = new OpenAPIHono()
  .openapi(getTransactionsRoute, async (c) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      const { from, to, accountId } = c.req.valid("query");
      const accountRef = accountId
        ? { ownerId: user.id, id: accountId }
        : { ownerId: user.id };
      const defTo = new Date();
      const defFrom = subDays(new Date(), 30);
      const start = from ? parse(from, "yyyy-MM-dd", new Date()) : defFrom;
      const end = to ? parse(to, "yyyy-MM-dd", new Date()) : defTo;

      const transactions = await prismadb.transaction.findMany({
        where: {
          accountRef,
          createdAt: {
            gte: start,
            lte: end,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
          id: true,
          categoryRef: {
            select: {
              id: true,
              name: true,
            },
          },
          accountRef: {
            select: {
              id: true,
              name: true,
            },
          },
          amount: true,
          notes: true,
          payee: true,
        },
      });

      return c.json({ transactions }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ message: "Server error" }, 500);
    }
  })
  .openapi(getTransactionByIdRoute, async (c) => {
    try {
      const user = await getCurrentUser();
      const { id } = c.req.valid("param");
      if (!user) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      const transaction = await prismadb.transaction.findFirst({
        where: { id, accountRef: { ownerId: user.id } },
        select: {
          createdAt: true,
          id: true,
          categoryRef: {
            select: {
              id: true,
              name: true,
            },
          },
          accountRef: {
            select: {
              id: true,
              name: true,
            },
          },
          amount: true,
          notes: true,
          payee: true,
        },
      });

      return c.json({ transaction }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ message: "Server error" }, 500);
    }
  })
  .openapi(createTransactionRoute, async (c) => {
    try {
      const user = (await getCurrentUser())!;

      const values = c.req.valid("json");
      const {
        accountId,
        amount,
        categoryId,
        notes,
        payee,
        category,
        createdAt,
      } = values;

      let categoryRef = {};
      if (categoryId) {
        categoryRef = {
          categoryRef: { connect: { id: categoryId, ownerId: user.id } },
        };
      } else if (category) {
        let categoryRecord = await prismadb.category.findFirst({
          where: { name: category, ownerId: user.id },
        });

        if (!categoryRecord) {
          categoryRecord = await prismadb.category.create({
            data: { name: category, ownerId: user.id },
          });
        }

        categoryRef = {
          categoryRef: { connect: { id: categoryRecord.id, ownerId: user.id } },
        };
      }

      await prismadb.transaction.create({
        data: {
          accountRef: { connect: { id: accountId, ownerId: user.id } },
          amount,
          payee,
          notes: notes || null,
          createdAt: createdAt || undefined,
          ...categoryRef,
        },
        include: { categoryRef: true },
      });

      return c.json({ message: "Transaction created successfully" }, 201);
    } catch (error) {
      console.error(error);
      return c.json({ message: "Server error" }, 500);
    }
  })
  .openapi(patchTransactionRoute, async (c) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      const updateData = c.req.valid("json");

      const {
        accountId,
        amount,
        categoryId,
        notes,
        payee,
        category,
        id,
        createdAt,
      } = updateData;

      let categoryRef = {};
      if (categoryId) {
        categoryRef = {
          categoryRef: { connect: { id: categoryId, ownerId: user.id } },
        };
      } else if (category) {
        let categoryRecord = await prismadb.category.findFirst({
          where: { name: category, ownerId: user.id },
        });

        if (!categoryRecord) {
          categoryRecord = await prismadb.category.create({
            data: { name: category, ownerId: user.id },
          });
        }

        categoryRef = {
          categoryRef: { connect: { id: categoryRecord.id, ownerId: user.id } },
        };
      }

      await prismadb.transaction.update({
        where: { id, accountRef: { ownerId: user.id } },
        data: {
          ...(accountId && {
            accountRef: { connect: { id: accountId, ownerId: user.id } },
          }),
          ...(amount !== undefined && { amount }),
          ...(payee && { payee }),
          ...(notes !== undefined && { notes }),
          ...categoryRef,
          createdAt,
        },
      });

      return c.json({ message: "Transaction updated successfully" }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ message: "Error updating transaction" }, 500);
    }
  })
  .openapi(deleteTransactionsRoute, async (c) => {
    try {
      const user = (await getCurrentUser())!;

      const { ids } = c.req.valid("json");
      await prismadb.transaction.deleteMany({
        where: { id: { in: ids }, accountRef: { ownerId: user.id } },
      });

      return c.json(
        { message: `${ids.length} transactions deleted successfully` },
        201
      );
    } catch (error) {
      console.error(error);
      return c.json({ message: "Server error" }, 500);
    }
  });

export default transactions;
