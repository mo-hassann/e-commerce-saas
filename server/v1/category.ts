import db from "@/db";

import { verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";

import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { and, eq, sql, desc, inArray, asc } from "drizzle-orm";
import { categoryTable, productPropertiesTable, productTable, productTagTable, userFavoritedProductsTable, userProductInteractionTable, userPurchaseTable } from "@/db/schemas";
import { productSearchFilters } from "@/validators/products";

const app = new Hono().get("/", async (c) => {
  // todo get the store
  const storeId = "a04df90d-7155-4cc3-899f-0c6e88b4ca5a";
  try {
    const categories = await db.select({ id: categoryTable.id, name: categoryTable.name }).from(categoryTable).leftJoin(productTable, eq(productTable.categoryId, categoryTable.id)).where(eq(productTable.storeId, storeId)).groupBy(categoryTable.id);
    return c.json({ data: categories });
  } catch (error: any) {
    return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
  }
});

export default app;
