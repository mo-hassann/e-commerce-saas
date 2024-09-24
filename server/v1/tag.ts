import db from "@/db";

import { verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";

import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { and, eq, sql, desc, inArray, asc, ne } from "drizzle-orm";
import { tagTable, productTable, productTagTable, storeTable, userFavoritedProductsTable, userProductInteractionTable, userPurchaseTable } from "@/db/schemas";
import { productSearchFilters } from "@/validators/products";
import { curStore } from "@/lib/server/get-cur-store";

const app = new Hono()
  .get("/", curStore(), async (c) => {
    const store = c.get("store");
    try {
      const tags = await db.select({ id: tagTable.id, name: tagTable.name }).from(tagTable).where(eq(tagTable.storeId, store.id));
      return c.json({ data: tags });
    } catch (error: any) {
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  })
  .post("/", curStore(), verifyAuth(), zValidator("json", z.object({ id: z.string().uuid().optional(), name: z.string() })), async (c) => {
    const { session } = c.get("authUser");

    const adminId = session.user?.id!;
    const store = c.get("store");
    const tag = c.req.valid("json");

    try {
      // check for the store admin
      if (store.adminId !== adminId) return c.json({ errorMessage: "you have no permeation to edit this tag" }, 400);

      // edit or add new tag
      if (tag.id) {
        await db
          .update(tagTable)
          .set({ name: tag.name })
          .where(and(eq(tagTable.id, tag.id), eq(tagTable.storeId, store.id)));
      } else {
        await db.insert(tagTable).values({ name: tag.name, storeId: store.id });
      }

      return c.json({ message: "tag saved successfully" });
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
    if (store.adminId !== adminId) return c.json({ errorMessage: "you have no permeation to delete this tag" }, 400);

    try {
      const tagsToDelete = db.$with("tags_to_delete").as(
        db
          .select({ id: tagTable.id })
          .from(tagTable)
          .leftJoin(storeTable, eq(tagTable.storeId, store.id))
          .where(and(inArray(tagTable.id, ids), eq(storeTable.adminId, adminId)))
      );

      await db
        .with(tagsToDelete)
        .delete(tagTable)
        .where(inArray(tagTable.id, sql`(select * from ${tagsToDelete})`));

      return c.json({ message: "tags deleted successfully" });
    } catch (error: any) {
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  });

export default app;
