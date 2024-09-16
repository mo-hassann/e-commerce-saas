import db from "@/db";

import { Hono } from "hono";

import { eq } from "drizzle-orm";
import { productTable, productTagTable, tagTable } from "@/db/schemas";

const app = new Hono().get("/", async (c) => {
  // TODO: get the store
  const storeId = "a04df90d-7155-4cc3-899f-0c6e88b4ca5a";
  try {
    const tags = await db.select({ id: tagTable.id, name: tagTable.name }).from(tagTable).leftJoin(productTagTable, eq(productTagTable.tagId, tagTable.id)).leftJoin(productTable, eq(productTagTable.productId, productTable.id)).where(eq(productTable.storeId, storeId)).groupBy(tagTable.id);

    return c.json({ data: tags });
  } catch (error: any) {
    return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
  }
});

export default app;
