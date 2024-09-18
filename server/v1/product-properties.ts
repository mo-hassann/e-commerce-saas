import db from "@/db";

import { Hono } from "hono";

import { eq } from "drizzle-orm";
import { productColorTable, productSizesTable, productTable } from "@/db/schemas";

const app = new Hono().get("/", async (c) => {
  // TODO: get the store
  const storeId = "a04df90d-7155-4cc3-899f-0c6e88b4ca5a";
  try {
    const colors = await db.select({ id: productColorTable.id, color: productColorTable.color }).from(productColorTable).leftJoin(productTable, eq(productColorTable.productId, productTable.id)).where(eq(productTable.storeId, storeId)).groupBy(productColorTable.id);

    const sizes = await db.select({ id: productSizesTable.id, size: productSizesTable.size }).from(productSizesTable).leftJoin(productTable, eq(productSizesTable.productId, productTable.id)).where(eq(productTable.storeId, storeId)).groupBy(productSizesTable.id);

    return c.json({ data: { colors: colors, sizes } });
  } catch (error: any) {
    return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
  }
});

export default app;
