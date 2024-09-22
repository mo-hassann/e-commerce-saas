import db from "@/db";

import { verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";

import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { and, eq, sql, desc, inArray, asc } from "drizzle-orm";
import { categoryTable, productTable, productTagTable, userFavoritedProductsTable, userProductInteractionTable, userPurchaseTable } from "@/db/schemas";
import { productSearchFilters } from "@/validators/products";
import { curStore } from "@/lib/server/get-cur-store";

const app = new Hono().get("/", curStore(), async (c) => {
  const store = c.get("store");
  try {
    const categories = await db.select({ id: categoryTable.id, name: categoryTable.name }).from(categoryTable).leftJoin(productTable, eq(productTable.categoryId, categoryTable.id)).where(eq(productTable.storeId, store.id)).groupBy(categoryTable.id);
    return c.json({ data: categories });
  } catch (error: any) {
    return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
  }
});

export default app;
