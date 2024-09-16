import db from "@/db";

import { Hono } from "hono";

import { eq } from "drizzle-orm";
import { brandTable, productTable } from "@/db/schemas";

const app = new Hono().get("/", async (c) => {
  // TODO: get the store
  const storeId = "a04df90d-7155-4cc3-899f-0c6e88b4ca5a";
  try {
    const brands = await db.select({ id: brandTable.id, name: brandTable.name }).from(brandTable).leftJoin(productTable, eq(productTable.brandId, brandTable.id)).where(eq(productTable.storeId, storeId)).groupBy(brandTable.id);

    return c.json({ data: brands });
  } catch (error: any) {
    return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
  }
});

export default app;
