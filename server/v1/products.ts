import db from "@/db";

import { verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";

import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { and, eq, sql, desc, inArray, asc } from "drizzle-orm";
import { brandTable, categoryTable, productColorTable, productImageTable, productSizesTable, productTable, productTagTable, promoCodeTable, tagTable, userFavoritedProductsTable, userProductInteractionTable, userPurchaseTable } from "@/db/schemas";
import { productSearchFilters } from "@/validators/products";
import { curStore } from "@/lib/server/get-cur-store";
import { productFormSchema } from "@/validators/forms";

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
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  })
  .post("/", verifyAuth(), curStore(), zValidator("json", productFormSchema), async (c) => {
    const { session } = c.get("authUser");
    const adminId = session.user?.id!;
    const store = c.get("store");

    // check for the cur user is the admin
    if (store.adminId !== adminId) {
      return c.json({ errorMessage: "You are not authorized to access this endpoint" }, 403);
    }
    const product = c.req.valid("json");

    console.log("starting to update product");

    // add product
    // return c.json({ message: "product added successfully" });
    try {
      if (!!product.id) {
        // update product
        await db
          .update(productTable)
          .set({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            oldPrice: product.oldPrice?.toString(),
            stock: product.stock,
            brandId: product.brandId,
            categoryId: product.categoryId,
          })
          .where(eq(productTable.id, product.id));

        console.log("update product");
        // delete all tags and add new tags
        await db.delete(productTagTable).where(eq(productTagTable.productId, product.id));
        if (product.tagsIds?.length) {
          const tagsToAdd = product.tagsIds.map((tagId) => ({ productId: product.id!, tagId }));
          await db.insert(productTagTable).values([...tagsToAdd]);
        }

        console.log("product deleted successfully");
        // delete all colors and add new colors
        await db.delete(productColorTable).where(eq(productColorTable.productId, product.id));
        if (product.colors?.length) {
          const colorsToAdd = product.colors.map((color) => ({ productId: product.id!, color }));
          await db.insert(productColorTable).values([...colorsToAdd]);
        }
        console.log("colors deleted successfully");
        // delete all sizes and add new sizes
        await db.delete(productSizesTable).where(eq(productSizesTable.productId, product.id));
        if (product.sizes?.length) {
          const sizesToAdd = product.sizes.map((size) => ({ productId: product.id!, size }));
          await db.insert(productSizesTable).values([...sizesToAdd]);
        }
        console.log("sizes deleted successfully");
      } else {
        // create product
        const [newProduct] = await db
          .insert(productTable)
          .values({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            oldPrice: product.oldPrice?.toString(),
            stock: product.stock,
            brandId: product.brandId,
            categoryId: product.categoryId,
            adminId,
            storeId: store.id,
          })
          .returning({ id: productTable.id });

        // add tags
        if (product.tagsIds?.length) {
          const tagsToAdd = product.tagsIds.map((tagId) => ({ productId: newProduct.id, tagId }));
          await db.insert(productTagTable).values([...tagsToAdd]);
        }

        // add colors
        if (product.colors?.length) {
          const colorsToAdd = product.colors.map((color) => ({ productId: newProduct.id, color }));
          await db.insert(productColorTable).values([...colorsToAdd]);
        }

        // add sizes
        if (product.sizes?.length) {
          const sizesToAdd = product.sizes.map((size) => ({ productId: newProduct.id, size }));
          await db.insert(productSizesTable).values([...sizesToAdd]);
        }
      }

      return c.json({ message: "product added successfully" });
    } catch (error: any) {
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  })
  .get("/dashboard-products", verifyAuth(), curStore(), async (c) => {
    const { session } = c.get("authUser");
    const adminId = session.user?.id!;
    const store = c.get("store");

    // check for the cur user is the admin
    if (store.adminId !== adminId) {
      return c.json({ errorMessage: "You are not authorized to access this endpoint" }, 403);
    }

    try {
      //get all products for this store to show it in the dashboard
      const products = await db
        .select({
          id: productTable.id,
          name: productTable.name,
          brand: brandTable.name,
          category: categoryTable.name,
          oldPrice: productTable.oldPrice,
          price: productTable.price,
          reviewedNumber: productTable.reviewedNumber,
          rating: productTable.rating,
          purchases: productTable.purchases,
          description: productTable.description,
          stock: productTable.stock,
          image: productImageTable.url,
          lastUpdate: productTable.updatedAt,
          createdAt: productTable.createdAt,
        })
        .from(productTable)
        .leftJoin(brandTable, eq(brandTable.id, productTable.brandId))
        .leftJoin(categoryTable, eq(categoryTable.id, productTable.categoryId))
        .leftJoin(productImageTable, eq(productImageTable.productId, productTable.id))
        .leftJoin(promoCodeTable, eq(promoCodeTable.productId, productTable.id))
        .where(eq(productTable.storeId, store.id))
        .orderBy(desc(productTable.createdAt))
        .groupBy(productTable.id, brandTable.name, categoryTable.name, productImageTable.url);

      return c.json({ data: products });
    } catch (error: any) {
      console.log(error.message, error, "error ---------------");
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
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
      return c.json({ errorMessage: error.message, cause: error.cause, error });
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
  .post("/user-interactions", verifyAuth(), zValidator("json", z.object({ productId: z.string().uuid(), rating: z.number(), review: z.string().optional() })), async (c) => {
    const { session } = c.get("authUser");
    const userId = session.user?.id!;

    const { productId, rating, review } = c.req.valid("json");

    try {
      // check for user current product purchase
      const [productPurchased] = await db
        .select()
        .from(userPurchaseTable)
        .where(and(eq(userPurchaseTable.userId, userId), eq(userPurchaseTable.productId, productId)));

      if (!productPurchased) return c.json({ errorMessage: "you must purchase the product to be able to review it" }, 400);

      await db
        .insert(userProductInteractionTable)
        .values({ productId, userId, rating: `${rating}`, review })
        .onConflictDoUpdate({ target: [userProductInteractionTable.productId, userProductInteractionTable.userId], set: { rating: `${rating}`, review } });

      return c.json({ message: "user interaction added successfully" });
    } catch (error: any) {
      console.log(error.message);
      return c.json({ errorMessage: error.message, cause: error.cause, error });
    }
  })
  .get("/:productId", zValidator("param", z.object({ productId: z.string().uuid() })), async (c) => {
    const { productId } = c.req.valid("param");
    try {
      const [product] = await db
        .select({
          id: productTable.id,
          brand: brandTable,
          category: categoryTable,
          price: productTable.price,
          oldPrice: productTable.oldPrice,
          name: productTable.name,
          reviewedNumber: productTable.reviewedNumber,
          rating: productTable.rating,
          description: productTable.description,
          stock: productTable.stock,
        })
        .from(productTable)
        .leftJoin(categoryTable, eq(categoryTable.id, productTable.categoryId))
        .leftJoin(brandTable, eq(brandTable.id, productTable.brandId))
        .where(eq(productTable.id, productId));

      const productImages = await db.select().from(productImageTable).where(eq(productImageTable.productId, productId)).orderBy(productImageTable.order);
      const tags = await db
        .select({
          id: tagTable.id,
          name: tagTable.name,
        })
        .from(tagTable)
        .leftJoin(productTagTable, eq(productTagTable.tagId, tagTable.id))
        .where(eq(productTagTable.productId, productId));

      const colors = await db.select().from(productColorTable).where(eq(productColorTable.productId, productId));
      const sizes = await db.select().from(productSizesTable).where(eq(productSizesTable.productId, productId));

      return c.json({ data: { ...product, tags, properties: { colors, sizes }, productImages } });
    } catch (error: any) {
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  });

export default app;
