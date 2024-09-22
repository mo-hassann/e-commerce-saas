import db from "@/db";

import { Hono } from "hono";

import { eq } from "drizzle-orm";
import { brandTable, productTable } from "@/db/schemas";
import { curStore } from "@/lib/server/get-cur-store";

const app = new Hono().get("/", curStore(), async (c) => {
  const store = c.get("store");
  try {
    const brands = await db.select({ id: brandTable.id, name: brandTable.name }).from(brandTable).leftJoin(productTable, eq(productTable.brandId, brandTable.id)).where(eq(productTable.storeId, store.id)).groupBy(brandTable.id);

    return c.json({ data: brands });
  } catch (error: any) {
    return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
  }
});

export default app;
