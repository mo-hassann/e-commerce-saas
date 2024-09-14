import { pgTable, uuid, text, varchar, date, timestamp, numeric, integer, boolean, pgEnum, unique } from "drizzle-orm/pg-core";

// Roles enum for user
export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

// Enum for product size
export const sizeEnum = pgEnum("size", ["XS", "S", "M", "L", "XL", "XXL"]);

// User table with roles
export const userTable = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("user_name", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  dateOfBirth: date("date_of_birth"),
  role: roleEnum("role").notNull().default("USER"), // Role for users (USER, ADMIN)
});

// Store table
export const storeTable = pgTable("store", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  storeName: varchar("store_name").unique().notNull(), // the name of the subdomain of the store
  storeUrl: varchar("url").unique(), // if the user (admin) decided to add custom domain to they store
  description: text("description"),
  adminId: uuid("admin_id")
    .references(() => userTable.id, { onDelete: "cascade" })
    .notNull(), // References user who is the admin
});

// Category table
export const categoryTable = pgTable("category", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

// Tag table
export const tagTable = pgTable("tag", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "new", "hot"
});

// Brand table
export const brandTable = pgTable("brand", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
});

// Product table
export const productTable = pgTable("product", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  oldPrice: numeric("old_price", { precision: 10, scale: 2 }),
  categoryId: uuid("category_id").references(() => categoryTable.id), // References the category
  brandId: uuid("brand_id").references(() => brandTable.id), // References the brand
  rating: numeric("rating", { precision: 2, scale: 1 }).default("0"), // Rating out of 5.0
  adminId: uuid("admin_id")
    .references(() => userTable.id)
    .notNull(), // References admin who manages the product
  storeId: uuid("store_id")
    .references(() => storeTable.id, { onDelete: "cascade" })
    .notNull(), // References the store the product belongs to
  reviewedNumber: integer("reviewed_number").default(0), // Number of reviews
  purchases: integer("purchases").default(0), // Number of purchases
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Product-Tag relation table (Many-to-many relation between product and tags)
export const productTagTable = pgTable("product_tag", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  productId: uuid("product_id")
    .references(() => productTable.id, { onDelete: "cascade" })
    .notNull(),
  tagId: uuid("tag_id")
    .references(() => tagTable.id, { onDelete: "cascade" })
    .notNull(),
});

// Product properties table (size, color, stock)
export const productPropertiesTable = pgTable("product_properties", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  productId: uuid("product_id")
    .references(() => productTable.id, { onDelete: "cascade" })
    .notNull(), // References the product
  size: sizeEnum("size").notNull(), // Size (enum: XS, S, M, L, XL, XXL)
  color: varchar("color", { length: 100 }), // e.g., "red", "blue"
  stock: integer("stock").default(0), // Number of items with this property in stock
});

// Product images table
export const productImageTable = pgTable("product_properties", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  productId: uuid("product_id")
    .references(() => productTable.id, { onDelete: "no action" }) // because if the product deleted, the linked url of the image and the image in the cloud will not be deleted so we must keep it the db
    .notNull(), // References the product
  url: text("url").notNull(),
  description: varchar("description", { length: 255 }),
  order: integer("order").default(1),
});

// Promo code table
export const promoCodeTable = pgTable("promo_code", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  code: varchar("code", { length: 255 }).notNull(),
  discount: numeric("discount", { precision: 5, scale: 2 }).notNull(), // Percentage or fixed discount
  adminId: uuid("admin_id")
    .references(() => userTable.id, { onDelete: "cascade" })
    .notNull(), // References to the user (admin) who creates the promo code
  storeId: uuid("store_id").references(() => storeTable.id, { onDelete: "cascade" }), // References store if the promo code is specific to it and if value is null the promo code will work in all the stores in this application (only super admin users who can create a promo code like this)
  productId: uuid("product_id").references(() => productTable.id, { onDelete: "cascade" }), // References product if the promo code is specific to it and if not the promo code will work in all the products in this store
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  validUntil: timestamp("valid_until", { withTimezone: true }),
});

// User purchase product table
export const userPurchaseTable = pgTable("user_purchase", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").references(() => userTable.id, { onDelete: "set null" }), // if the user account is deleted the purchase table must be exist to aper in admin statistics
  productId: uuid("product_id")
    .references(() => productTable.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity").notNull().default(1),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// User interactions table (reviews, ratings)
export const userProductInteractionTable = pgTable(
  "user_product_interaction",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").references(() => userTable.id, { onDelete: "set null" }), // if the user account is deleted the rating and review will stay
    productId: uuid("product_id")
      .references(() => productTable.id, { onDelete: "cascade" })
      .notNull(),
    review: text("review"),
    rating: numeric("rating", { precision: 2, scale: 1 }).notNull(), // User's rating for the product (1-5)
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    // the user can make one interaction for the same product
    unq: unique("unique_user_product_interaction").on(table.userId, table.productId),
  })
);

// Favorited Products By the User
export const userFavoritedProductsTable = pgTable("user_favorited_products_table", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").references(() => userTable.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .references(() => productTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
