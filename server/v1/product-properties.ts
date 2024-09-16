import db from "@/db";

import { Hono } from "hono";

import { eq } from "drizzle-orm";
import { productPropertiesTable, productTable } from "@/db/schemas";

const app = new Hono().get("/", async (c) => {
  // TODO: get the store
  const storeId = "a04df90d-7155-4cc3-899f-0c6e88b4ca5a";
  try {
    const colors = (await db
      .select({ color: productPropertiesTable.color })
      .from(productPropertiesTable)
      .leftJoin(productTable, eq(productPropertiesTable.productId, productTable.id))
      .where(eq(productTable.storeId, storeId))
      .groupBy(productPropertiesTable.color)
      .then((res) => res.filter((item) => !!item.color))) as { color: string }[];

    const sizes = await db.select({ sizes: productPropertiesTable.size }).from(productPropertiesTable).leftJoin(productTable, eq(productPropertiesTable.productId, productTable.id)).where(eq(productTable.storeId, storeId)).groupBy(productPropertiesTable.size);

    return c.json({ data: { colors: colors, sizes } });
  } catch (error: any) {
    return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
  }
});

export default app;
