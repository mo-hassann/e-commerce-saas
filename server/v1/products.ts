import { verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import db from "@/db";
import { productPropertiesTable, productTable, productTagTable, userProductInteractionTable } from "@/db/schemas";
import { and, between, eq, gte, isNull, lte, or, sql, desc, inArray, asc } from "drizzle-orm";
import { stringArrayTransform } from "@/lib/zod";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        brandIds: stringArrayTransform.pipe(z.array(z.string().uuid())).default([]), // we use this costume method because we are dealing with url queries and all the data in type string
        categoryIds: stringArrayTransform.pipe(z.array(z.string().uuid())).default([]),
        tagIds: stringArrayTransform.pipe(z.array(z.string().uuid())).default([]),
        minPrice: z.coerce.number().optional(),
        maxPrice: z.coerce.number().optional(),
        minRating: z.coerce.number().optional(),
        maxRating: z.coerce.number().optional(),
        searchKey: z.string().optional(),
        color: z.string().optional(),
        size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]).optional(),
        sortBy: z.enum(["POPULAR", "NEWEST", "HIGH_PRICE", "LOW_PRICE"]).default("POPULAR"),
      })
    ),
    async (c) => {
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
          .select()
          .from(productTable)
          .leftJoin(productTagTable, eq(productTable.id, productTagTable.productId))
          .leftJoin(productPropertiesTable, eq(productTable.id, productPropertiesTable.productId))
          .where(
            sql`${brandIds.length > 0 ? sql`${inArray(productTable.brandId, brandIds)}` : sql`1=1`}
            AND ${categoryIds.length > 0 ? sql`${inArray(productTable.categoryId, categoryIds)}` : sql`1=1`}
            AND ${tagIds.length > 0 ? sql`${inArray(productTagTable.tagId, tagIds)}` : sql`1=1`}
            AND ${minPrice ? sql`${productTable.price} >= ${minPrice}` : sql`1=1`}
            AND ${maxPrice ? sql`${productTable.price} <= ${maxPrice}` : sql`1=1`}
            AND ${minRating ? sql`${productTable.rating} >= ${minRating}` : sql`1=1`}
            AND ${maxRating ? sql`${productTable.rating} <= ${maxRating}` : sql`1=1`}
            AND ${color ? sql`${productPropertiesTable.color} = ${color}` : sql`1=1`}
            AND ${size ? sql`${productPropertiesTable.size} = ${size}` : sql`1=1`}
            AND ${searchKey ? sql`${productTable.name} ILIKE ${`%${searchKey}%`} OR ${productTable.description} ILIKE ${`%${searchKey}%`}` : sql`1=1`}
            `
          )
          .orderBy(...orderConditions);
        return c.json({ message: "this is public route!", products });
      } catch (error: any) {
        console.log(error.message);
        return c.json({ message: error.message, cause: error.cause, error });
      }
    }
  )
  .get("/favorite", verifyAuth(), async (c) => {
    const { session } = c.get("authUser");
    const userId = session.user?.id!;

    try {
      const products = await db
        .select()
        .from(userProductInteractionTable)
        .where(and(eq(userProductInteractionTable.favorited, true), eq(userProductInteractionTable.userId, userId)))
        .leftJoin(productTable, eq(userProductInteractionTable.productId, productTable.id))
        .orderBy(desc(userProductInteractionTable.updatedAt));

      return c.json({ data: products });
    } catch (error: any) {
      console.log(error.message);
      return c.json({ message: error.message, cause: error.cause, error });
    }
  });

export default app;
