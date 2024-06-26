import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import prismadb from "@/lib/prismabd";
import getCurrentUser from "@/actions";
import * as z from "zod";
import { parse, subDays } from "date-fns";
import { transactionSchema } from "@/models/Schemas/Setup";

const transactions = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        from: z.string(),
        to: z.string(),
        accountId: z.string(),
      })
    ),
    async (c) => {
      try {
        const user = await getCurrentUser();
        const { from, to, accountId } = c.req.valid("query");

        const defTo = new Date();
        const defFrom = subDays(new Date(), 30);
        const start = from ? parse(from, "yyyy-MM-dd", new Date()) : defFrom;
        const end = to ? parse(to, "yyyy-MM-dd", new Date()) : defTo;

        const transactions = await prismadb.transaction.findMany({
          where: {
            accountRef: { ownerId: user?.id },
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
        console.log(
          error,
          "##########finance transactions get ###############"
        );
        return c.json({ error: "error in server" }, 500);
      }
    }
  )
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),

    async (c) => {
      try {
        const user = await getCurrentUser();
        const { id } = c.req.valid("param");
        if (!id) {
          return c.json({ message: "Missing required fields: Id" }, 401);
        }
        const transaction = await prismadb.transaction.findFirst({
          where: { id, accountRef: { ownerId: user?.id } },
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
        console.log(error, "##########finance transaction get ###############");
        return c.json({ error: "error in server" }, 500);
      }
    }
  )
  .post(
    "/patch",
    zValidator(
      "json",
      z.intersection(transactionSchema, z.object({ id: z.string() }))
    ),

    async (c) => {
      try {
        const user = await getCurrentUser();
        const values = c.req.valid("json");
        const {
          accountId,
          amount,
          categoryId,
          notes,
          payee,
          id,
          createdAt,
          category,
        } = values;
        if (!values) {
          return c.json({ message: "Missing required fields" }, 401);
        }
        if (!user) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        const categoryRef = categoryId
          ? {
              categoryRef: { connect: { id: categoryId, ownerId: user?.id } },
            }
          : category
          ? {
              categoryRef: { create: { name: category, ownerId: user?.id } },
            }
          : {};

        await prismadb.transaction.update({
          where: { id, accountRef: { ownerId: user.id } },
          data: {
            accountRef: { connect: { id: accountId, ownerId: user?.id } },
            amount,
            payee,
            createdAt: createdAt!,
            notes,
            ...categoryRef,
          },
        });

        return c.json({ message: "patched with success" }, 200);
      } catch (error) {
        console.log(error, "##########finance transaction get ###############");
        return c.json({ message: "error in server" }, 500);
      }
    }
  )
  .post("/", zValidator("json", transactionSchema.array()), async (c) => {
    const values = c.req.valid("json");

    if (!values) {
      return c.json({ message: "Missing required fields" }, { status: 400 });
    }
    try {
      const user = await getCurrentUser();
      if (!user) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      const filterderData = values.map((el) => {
        const {
          accountId,
          amount,
          categoryId,
          notes,
          payee,
          category,
          createdAt,
        } = el;
        const categoryRef = categoryId
          ? {
              categoryRef: { connect: { id: categoryId, ownerId: user.id } },
            }
          : category
          ? {
              categoryRef: { create: { name: category, ownerId: user.id } },
            }
          : {};

        let obj: any = {
          accountRef: { connect: { id: accountId, ownerId: user.id } },
          amount,
          payee,
          notes,
          ...categoryRef,
        };

        if (!!createdAt) {
          obj = { ...obj, createdAt };
        }
        return {
          accountRef: { connect: { id: accountId, ownerId: user.id } },
          amount,
          payee,
          notes,
          ...categoryRef,
        };
      });
      filterderData.forEach(async (e) => {
        await prismadb.transaction.create({
          data: e,
        });
      });

      return c.json(
        { message: "your new finance transaction is ready" },
        { status: 200 }
      );
    } catch (error) {
      console.log(
        error,
        "##########finance transaction create ###############"
      );
      return c.json({ message: "error in server" }, 500);
    }
  })
  .post(
    "/delete",
    zValidator(
      "json",
      z.object({
        Ids: z.array(z.string()),
      })
    ),
    async (c) => {
      const { Ids } = c.req.valid("json");
      if (!(Ids.length > 0)) {
        return c.json({ message: "Missing required fields: Ids" }, 400);
      }
      try {
        const user = await getCurrentUser();
        !!user &&
          (await prismadb.transaction.deleteMany({
            where: { id: { in: Ids }, accountRef: { ownerId: user.id } },
          }));

        return c.json(
          {
            message: `${Ids.length} of selected finance transactions has been deleted successfully`,
          },
          { status: 201 }
        );
      } catch (error) {
        console.log(
          error,
          "##########Finance transaction Delete ###############"
        );
        return c.json({ message: "error in server while deleteing" }, 500);
      }
    }
  );

export default transactions;
