import db from "@/db";

import { Hono } from "hono";

import { eq } from "drizzle-orm";
import { productTable, productTagTable, tagTable } from "@/db/schemas";
import { curStore } from "@/lib/server/get-cur-store";

const app = new Hono().get("/", curStore(), async (c) => {
  const store = c.get("store");
  try {
    const tags = await db.select({ id: tagTable.id, name: tagTable.name }).from(tagTable).leftJoin(productTagTable, eq(productTagTable.tagId, tagTable.id)).leftJoin(productTable, eq(productTagTable.productId, productTable.id)).where(eq(productTable.storeId, store.id)).groupBy(tagTable.id);

    return c.json({ data: tags });
  } catch (error: any) {
    return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
  }
});

export default app;
