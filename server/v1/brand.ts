import db from "@/db";

import { verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";

import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { and, eq, sql, desc, inArray, asc, ne } from "drizzle-orm";
import { brandTable, productTable, productTagTable, storeTable, userFavoritedProductsTable, userProductInteractionTable, userPurchaseTable } from "@/db/schemas";
import { productSearchFilters } from "@/validators/products";
import { curStore } from "@/lib/server/get-cur-store";

const app = new Hono()
  .get("/", curStore(), async (c) => {
    const store = c.get("store");
    try {
      const brands = await db.select({ id: brandTable.id, name: brandTable.name }).from(brandTable).where(eq(brandTable.storeId, store.id));
      return c.json({ data: brands });
    } catch (error: any) {
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  })
  .post("/", curStore(), verifyAuth(), zValidator("json", z.object({ id: z.string().uuid().optional(), name: z.string() })), async (c) => {
    const { session } = c.get("authUser");

    const adminId = session.user?.id!;
    const store = c.get("store");
    const brand = c.req.valid("json");

    try {
      // check for the store admin
      if (store.adminId !== adminId) return c.json({ errorMessage: "you have no permeation to edit this brand" }, 400);

      // edit or add new brand
      if (brand.id) {
        await db
          .update(brandTable)
          .set({ name: brand.name })
          .where(and(eq(brandTable.id, brand.id), eq(brandTable.storeId, store.id)));
      } else {
        await db.insert(brandTable).values({ name: brand.name, storeId: store.id });
      }

      return c.json({ message: "brand saved successfully" });
    } catch (error: any) {
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  })
  .delete("/", curStore(), verifyAuth(), zValidator("json", z.object({ ids: z.array(z.string().uuid()) })), async (c) => {
    const { session } = c.get("authUser");

    const adminId = session.user?.id!;
    const store = c.get("store");
    const { ids } = c.req.valid("json");

    // check for the admin
    if (store.adminId !== adminId) return c.json({ errorMessage: "you have no permeation to delete this brand" }, 400);

    try {
      const brandsToDelete = db.$with("brands_to_delete").as(
        db
          .select({ id: brandTable.id })
          .from(brandTable)
          .leftJoin(storeTable, eq(brandTable.storeId, store.id))
          .where(and(inArray(brandTable.id, ids), eq(storeTable.adminId, adminId)))
      );

      await db
        .with(brandsToDelete)
        .delete(brandTable)
        .where(inArray(brandTable.id, sql`(select * from ${brandsToDelete})`));

      return c.json({ message: "brands deleted successfully" });
    } catch (error: any) {
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  });

export default app;
