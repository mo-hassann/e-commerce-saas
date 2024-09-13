import { relations } from "drizzle-orm";
import { userTable, storeTable, categoryTable, tagTable, brandTable, productTable, productTagTable, productPropertiesTable, promoCodeTable, userProductInteractionTable, productImageTable, userFavoritedProductsTable } from "./";

// User relations
export const userRelations = relations(userTable, ({ one, many }) => ({
  stores: many(storeTable), // A user can be an admin of many stores
  products: many(productTable), // A user (admin) can manage many products
  interactions: many(userProductInteractionTable), // A user can have many interactions (favorites, ratings)
  favorites: many(userFavoritedProductsTable), // A user can have many favorites
  promoCodes: many(promoCodeTable), // A user (admin) can have many promo codes
}));

// Store relations
export const storeRelations = relations(storeTable, ({ one, many }) => ({
  admin: one(userTable, {
    fields: [storeTable.adminId],
    references: [userTable.id],
  }), // A store has one admin (user)
  products: many(productTable), // A store can have many products
  promoCodes: many(promoCodeTable), // A store can have many promo codes (work only in this store)
}));

// Category relations
export const categoryRelations = relations(categoryTable, ({ many }) => ({
  products: many(productTable), // A category can have many products
}));

// Tag relations
export const tagRelations = relations(tagTable, ({ many }) => ({
  productTags: many(productTagTable), // A tag can be linked to many product-tag relationships
}));

// Brand relations
export const brandRelations = relations(brandTable, ({ many }) => ({
  products: many(productTable), // A brand can have many products
}));

// Product relations
export const productRelations = relations(productTable, ({ one, many }) => ({
  admin: one(userTable, {
    fields: [productTable.adminId],
    references: [userTable.id],
  }), // A product is managed by one admin (user)
  store: one(storeTable, {
    fields: [productTable.storeId],
    references: [storeTable.id],
  }), // A product belongs to one store
  category: one(categoryTable, {
    fields: [productTable.categoryId],
    references: [categoryTable.id],
  }), // A product belongs to one category
  brand: one(brandTable, {
    fields: [productTable.brandId],
    references: [brandTable.id],
  }), // A product belongs to one brand
  productTags: many(productTagTable), // A product can be linked to many product-tag relationships
  properties: many(productPropertiesTable), // A product can have many properties (size, color, stock)
  images: many(productImageTable), // A product can have many product images
  promoCodes: many(promoCodeTable), // A product can have many promo codes
  interactions: many(userProductInteractionTable), // A product can have many user interactions (favorites, ratings)
  favorites: many(userFavoritedProductsTable), // A product can have many user favorites
}));

// Product-Tag relations (junction table for many-to-many relationship)
export const productTagRelations = relations(productTagTable, ({ one }) => ({
  product: one(productTable, {
    fields: [productTagTable.productId],
    references: [productTable.id],
  }), // A product-tag relationship belongs to one product
  tag: one(tagTable, {
    fields: [productTagTable.tagId],
    references: [tagTable.id],
  }), // A product-tag relationship belongs to one tag
}));

// Product Properties relations
export const productPropertiesRelations = relations(productPropertiesTable, ({ one }) => ({
  product: one(productTable, {
    fields: [productPropertiesTable.productId],
    references: [productTable.id],
  }), // Properties are linked to one product
}));

// Product images relations
export const productImagesRelations = relations(productImageTable, ({ one }) => ({
  product: one(productTable, {
    fields: [productImageTable.productId],
    references: [productTable.id],
  }), // images are linked to one product
}));

// Promo Code relations
export const promoCodeRelations = relations(promoCodeTable, ({ one }) => ({
  product: one(productTable, {
    fields: [promoCodeTable.productId],
    references: [productTable.id],
  }), // A promo code can be used in one store if no relation the promo code will work in all the products in this store
  admin: one(userTable, {
    fields: [promoCodeTable.adminId],
    references: [userTable.id],
  }), // A promo code can belong to one user (admin)
  store: one(storeTable, {
    fields: [promoCodeTable.storeId],
    references: [storeTable.id],
  }), // A promo code can be applied to one product if no relation, the promo code will work in all the stores in this application (only super admin users who can create a promo code like this)
}));

// User-Product Interaction relations
export const userProductInteractionRelations = relations(userProductInteractionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userProductInteractionTable.userId],
    references: [userTable.id],
  }), // An interaction belongs to one user
  product: one(productTable, {
    fields: [userProductInteractionTable.productId],
    references: [productTable.id],
  }), // An interaction is linked to one product
}));
// User-Product Favorite relations
export const userFavoritedProductsRelations = relations(userFavoritedProductsTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userFavoritedProductsTable.userId],
    references: [userTable.id],
  }), // A Favorite belongs to one user
  product: one(productTable, {
    fields: [userFavoritedProductsTable.productId],
    references: [productTable.id],
  }), // A Favorite is linked to one product
}));
