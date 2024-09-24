import db from "@/db";

import { verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";

import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { and, eq, sql, desc, inArray, asc, ne } from "drizzle-orm";
import { categoryTable, productTable, productTagTable, storeTable, userFavoritedProductsTable, userProductInteractionTable, userPurchaseTable } from "@/db/schemas";
import { productSearchFilters } from "@/validators/products";
import { curStore } from "@/lib/server/get-cur-store";

const app = new Hono()
  .get("/", curStore(), async (c) => {
    const store = c.get("store");
    try {
      const categories = await db.select({ id: categoryTable.id, name: categoryTable.name }).from(categoryTable).where(eq(categoryTable.storeId, store.id));
      return c.json({ data: categories });
    } catch (error: any) {
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  })
  .post("/", curStore(), verifyAuth(), zValidator("json", z.object({ id: z.string().uuid().optional(), name: z.string() })), async (c) => {
    const { session } = c.get("authUser");

    const adminId = session.user?.id!;
    const store = c.get("store");
    const category = c.req.valid("json");

    try {
      // check for the store admin
      if (store.adminId !== adminId) return c.json({ errorMessage: "you have no permeation to edit this category" }, 400);

      // edit or add new category
      if (category.id) {
        await db
          .update(categoryTable)
          .set({ name: category.name })
          .where(and(eq(categoryTable.id, category.id), eq(categoryTable.storeId, store.id)));
      } else {
        await db.insert(categoryTable).values({ name: category.name, storeId: store.id });
      }

      return c.json({ message: "category saved successfully" });
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
    if (store.adminId !== adminId) return c.json({ errorMessage: "you have no permeation to delete this category" }, 400);

    try {
      const categoriesToDelete = db.$with("users_to_delete").as(
        db
          .select({ id: categoryTable.id })
          .from(categoryTable)
          .leftJoin(storeTable, eq(categoryTable.storeId, store.id))
          .where(and(inArray(categoryTable.id, ids), eq(storeTable.adminId, adminId)))
      );

      await db
        .with(categoriesToDelete)
        .delete(categoryTable)
        .where(inArray(categoryTable.id, sql`(select * from ${categoriesToDelete})`));

      return c.json({ message: "categories deleted successfully" });
    } catch (error: any) {
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  });

export default app;
