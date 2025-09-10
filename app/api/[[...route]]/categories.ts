import { OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import prismadb from "@/lib/prismabd";
import getCurrentUser from "@/actions";
import { createRoute } from "@hono/zod-openapi";

const CategoryResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  icon: z.string().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
});

const listCategoriesRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "List of user's categories",
      content: {
        "application/json": {
          schema: z.object({
            categories: z.array(CategoryResponseSchema),
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

const getCategoryRoute = createRoute({
  method: "get",
  path: "/{id}",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      description: "Category details",
      content: {
        "application/json": {
          schema: z.object({
            category: CategoryResponseSchema,
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
      description: "Category not found",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

const createCategoryRoute = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            name: z.string().min(1, "Name is required"),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Category created successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            category: CategoryResponseSchema,
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

const updateCategoryRoute = createRoute({
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
      description: "Category updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            category: CategoryResponseSchema,
          }),
        },
      },
    },
    404: {
      description: "Category not found",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    400: {
      description: "error happend in category route",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

const deleteCategoriesRoute = createRoute({
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
      description: "Categories deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: "No category IDs provided",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },
  },
});

const categories = new OpenAPIHono()
  .openapi(listCategoriesRoute, async (c) => {
    try {
      const user = await getCurrentUser();
      const categories = await prismadb.category.findMany({
        where: { ownerId: user!.id },
        orderBy: { createdAt: "desc" },
      });
      return c.json({ categories }, 200);
    } catch (error) {
      console.error("Error fetching categories:", error);
      return c.json({ message: "Error fetching categories" }, 500);
    }
  })
  .openapi(getCategoryRoute, async (c) => {
    try {
      const user = await getCurrentUser();
      const { id } = c.req.valid("param");
      console.log({ id, ownerId: user!.id });

      const category = await prismadb.category.findFirst({
        where: { id, ownerId: user!.id },
      });

      if (!category) {
        return c.json({ message: "Category not found" }, 404);
      }

      return c.json({ category }, 200);
    } catch (error) {
      console.error("Error fetching category:", error);
      return c.json({ message: "Error fetching category" }, 400);
    }
  })
  .openapi(createCategoryRoute, async (c) => {
    try {
      const user = await getCurrentUser();
      const data = c.req.valid("json");

      const category = await prismadb.category.create({
        data: {
          ...data,
          owner: { connect: { id: user!.id } },
        },
      });

      return c.json(
        {
          message: "Category created successfully",
          category,
        },
        201
      );
    } catch (error) {
      console.error("Error creating category:", error);
      return c.json({ message: "Error creating category" }, 400);
    }
  })
  .openapi(updateCategoryRoute, async (c) => {
    try {
      const user = await getCurrentUser();
      const { id, name } = c.req.valid("json");

      const category = await prismadb.category.update({
        where: { id, ownerId: user!.id },
        data: { name },
      });

      if (!category) {
        return c.json({ message: "Category not found" }, 404);
      }

      return c.json(
        {
          message: "Category updated successfully",
          category,
        },
        200
      );
    } catch (error) {
      console.error("Error updating category:", error);
      return c.json({ message: "Error updating category" }, 400);
    }
  })
  .openapi(deleteCategoriesRoute, async (c) => {
    try {
      const user = await getCurrentUser();
      const { ids } = c.req.valid("json");
      console.log(ids);
      if (!ids.length) {
        return c.json({ message: "No category ID provided" }, 400);
      }
      await prismadb.category.deleteMany({
        where: {
          id: { in: ids },
          ownerId: user!.id,
        },
      });

      return c.json(
        {
          message: `${ids.length} category deleted successfully`,
        },
        200
      );
    } catch (error) {
      console.error("Error deleting categories:", error);
      return c.json({ message: "Error deleting categories" }, 400);
    }
  });

export default categories;
