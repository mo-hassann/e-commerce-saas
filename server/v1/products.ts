import db from "@/db";

import { verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";

import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { and, eq, sql, desc, inArray, asc } from "drizzle-orm";
import { brandTable, categoryTable, productColorTable, productImageTable, productSizesTable, productTable, productTagTable, userFavoritedProductsTable, userProductInteractionTable, userPurchaseTable } from "@/db/schemas";
import { productSearchFilters } from "@/validators/products";

const app = new Hono()
  .get("/", zValidator("query", productSearchFilters), async (c) => {
    const { brandIds, categoryIds, maxPrice, maxRating, minPrice, minRating, searchKey, tagIds, sortBy, color, size } = c.req.valid("query");
    let orderConditions = [];

    switch (sortBy) {
      case "HIGH_PRICE":
        orderConditions.push(desc(productTable.price), desc(productTable.rating)), desc(productTable.reviewedNumber);
        break;
      case "LOW_PRICE":
        orderConditions.push(asc(productTable.price), desc(productTable.rating)), desc(productTable.reviewedNumber);
        break;
      case "NEWEST":
        orderConditions.push(desc(productTable.createdAt), desc(productTable.rating), desc(productTable.reviewedNumber));
        break;
      case "POPULAR": // POPULAR is the default case
        orderConditions.push(desc(productTable.rating), desc(productTable.reviewedNumber), desc(productTable.createdAt));
        break;
    }

    try {
      const products = await db
        .select({
          id: productTable.id,
          name: productTable.name,
          brandId: productTable.brandId,
          categoryId: productTable.categoryId,
          oldPrice: productTable.oldPrice,
          price: productTable.price,
          reviewedNumber: productTable.reviewedNumber,
          rating: productTable.rating,
          purchases: productTable.purchases,
          description: productTable.description,
        })
        .from(productTable)
        .leftJoin(productTagTable, eq(productTable.id, productTagTable.productId))
        .leftJoin(productColorTable, eq(productTable.id, productColorTable.productId))
        .leftJoin(productSizesTable, eq(productTable.id, productSizesTable.productId))
        .where(
          sql`${brandIds?.split("|")[0] ? sql`${inArray(productTable.brandId, brandIds.split("|"))}` : sql`1=1`}
            AND ${categoryIds?.split("|")[0] ? sql`${inArray(productTable.categoryId, categoryIds.split("|"))}` : sql`1=1`}
            AND ${tagIds?.split("|")[0] ? sql`${inArray(productTagTable.tagId, tagIds.split("|"))}` : sql`1=1`}
            AND ${minPrice ? sql`${productTable.price} >= ${minPrice}` : sql`1=1`}
            AND ${maxPrice ? sql`${productTable.price} <= ${maxPrice}` : sql`1=1`}
            AND ${minRating ? sql`${productTable.rating} >= ${minRating}` : sql`1=1`}
            AND ${maxRating ? sql`${productTable.rating} <= ${maxRating}` : sql`1=1`}
            AND ${color ? sql`${productColorTable.color} = ${color}` : sql`1=1`}
            AND ${size ? sql`${productSizesTable.size} = ${size}` : sql`1=1`}
            AND ${searchKey ? sql`${productTable.name} ILIKE ${`%${searchKey}%`} OR ${productTable.description} ILIKE ${`%${searchKey}%`}` : sql`1=1`}
            `
        )
        .orderBy(...orderConditions)
        .groupBy(productTable.id);
      return c.json({ data: products });
    } catch (error: any) {
      return c.json({ message: error.message, cause: error.cause, error }, 400);
    }
  })
  .get("/favorite", verifyAuth(), async (c) => {
    const { session } = c.get("authUser");
    const userId = session.user?.id!;

    try {
      const products = await db
        .select({
          id: productTable.id,
          name: productTable.name,
          brandId: productTable.brandId,
          categoryId: productTable.categoryId,
          oldPrice: productTable.oldPrice,
          price: productTable.price,
          reviewedNumber: productTable.reviewedNumber,
          rating: productTable.rating,
          purchases: productTable.purchases,
          description: productTable.description,
        })
        .from(productTable)
        .leftJoin(userFavoritedProductsTable, eq(userFavoritedProductsTable.productId, productTable.id))
        .where(eq(userFavoritedProductsTable.userId, userId))
        .orderBy(desc(userFavoritedProductsTable.createdAt))
        .groupBy(productTable.id, userFavoritedProductsTable.createdAt);

      return c.json({ data: products });
    } catch (error: any) {
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  })
  .post("/favorite", verifyAuth(), zValidator("json", z.object({ productId: z.string().uuid() })), async (c) => {
    const { session } = c.get("authUser");
    const userId = session.user?.id!;

    const { productId } = c.req.valid("json");

    try {
      const [favoriteProduct] = await db
        .select({ id: userFavoritedProductsTable.id })
        .from(userFavoritedProductsTable)
        .where(and(eq(userFavoritedProductsTable.productId, productId), eq(userFavoritedProductsTable.userId, userId)));

      if (favoriteProduct?.id) {
        await db.delete(userFavoritedProductsTable).where(eq(userFavoritedProductsTable.id, favoriteProduct.id));
      } else {
        await db.insert(userFavoritedProductsTable).values({ productId, userId });
      }

      return c.json({ message: "product favorite successfully" });
    } catch (error: any) {
      console.log(error.message);
      return c.json({ message: error.message, cause: error.cause, error });
    }
  })
  .get("/interactions", zValidator("query", z.object({ productId: z.string().uuid() })), async (c) => {
    const { productId } = c.req.valid("query");

    try {
      const interactions = await db.select().from(userProductInteractionTable).where(eq(userProductInteractionTable.productId, productId)).orderBy(desc(userProductInteractionTable.updatedAt));

      return c.json({ data: interactions });
    } catch (error: any) {
      console.log(error.message);
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  })
  .get("/user-interactions", verifyAuth(), zValidator("query", z.object({ productId: z.string().uuid() })), async (c) => {
    const { session } = c.get("authUser");
    const userId = session.user?.id!;

    const { productId } = c.req.valid("query");

    try {
      const interactions = await db
        .select()
        .from(userProductInteractionTable)
        .where(and(eq(userProductInteractionTable.userId, userId), eq(userProductInteractionTable.productId, productId)))
        .orderBy(desc(userProductInteractionTable.updatedAt));

      return c.json({ data: interactions });
    } catch (error: any) {
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  })
  .post("/interactions", verifyAuth(), zValidator("json", z.object({ productId: z.string().uuid(), rating: z.number(), review: z.string().optional() })), async (c) => {
    const { session } = c.get("authUser");
    const userId = session.user?.id!;

    const { productId, rating, review } = c.req.valid("json");

    try {
      // check for user current product purchase
      const [productPurchased] = await db
        .select()
        .from(userPurchaseTable)
        .where(and(eq(userPurchaseTable.userId, userId), eq(userPurchaseTable.productId, productId)));

      if (!productPurchased) return c.json({ message: "you must purchase the product to be able to review it" }, 400);

      await db
        .insert(userProductInteractionTable)
        .values({ productId, userId, rating: `${rating}`, review })
        .onConflictDoUpdate({ target: [userProductInteractionTable.productId, userProductInteractionTable.userId], set: { rating: `${rating}`, review } });

      return c.json({ message: "user interaction added successfully" });
    } catch (error: any) {
      console.log(error.message);
      return c.json({ message: error.message, cause: error.cause, error });
    }
  })
  .get("/:productId", zValidator("param", z.object({ productId: z.string().uuid() })), async (c) => {
    const { productId } = c.req.valid("param");
    try {
      const [product] = await db
        .select({
          id: productTable.id,
          brand: brandTable.name,
          category: categoryTable.name,
          price: productTable.price,
          oldPrice: productTable.oldPrice,
          name: productTable.name,
          reviewedNumber: productTable.reviewedNumber,
          rating: productTable.rating,
          description: productTable.description,
        })
        .from(productTable)
        .leftJoin(categoryTable, eq(categoryTable.id, productTable.categoryId))
        .leftJoin(brandTable, eq(brandTable.id, productTable.brandId))
        .where(eq(productTable.id, productId));

      const productImages = await db.select().from(productImageTable).where(eq(productImageTable.productId, productId)).orderBy(productImageTable.order);

      const colors = await db.select().from(productColorTable).where(eq(productColorTable.productId, productId));
      const sizes = await db.select().from(productSizesTable).where(eq(productSizesTable.productId, productId));

      return c.json({ data: { ...product, properties: { colors, sizes }, productImages } });
    } catch (error: any) {
      console.log(error.message);
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  });

export default app;
