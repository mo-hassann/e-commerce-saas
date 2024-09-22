import db from "@/db";

import { Hono } from "hono";

import { eq } from "drizzle-orm";
import { productColorTable, productSizesTable, productTable } from "@/db/schemas";
import { curStore } from "@/lib/server/get-cur-store";

const app = new Hono().get("/", curStore(), async (c) => {
  const store = c.get("store");
  try {
    const colors = await db.select({ id: productColorTable.id, color: productColorTable.color }).from(productColorTable).leftJoin(productTable, eq(productColorTable.productId, productTable.id)).where(eq(productTable.storeId, store.id)).groupBy(productColorTable.id);

    const sizes = await db.select({ id: productSizesTable.id, size: productSizesTable.size }).from(productSizesTable).leftJoin(productTable, eq(productSizesTable.productId, productTable.id)).where(eq(productTable.storeId, store.id)).groupBy(productSizesTable.id);

    return c.json({ data: { colors: colors, sizes } });
  } catch (error: any) {
    return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
  }
});

export default app;
