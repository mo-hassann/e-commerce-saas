# product

- every product have (title, description, color, size, price, discounted price, category, prand_name,rating, tag like new or hot )
- adminId, storeId
- properties like 30 day return policy
- product size: normal, big, extra_big
- rivew_number, byes_number

# search

- user can search for some product by its name
- user can also search by category and it shows in a different color in the search bar

# sidebar filters

- most used colors in the database, price progress and price inputs, brand check imputs, category check inputs
- each key is connected with the urt

# user

- users can add product to card, rate specific category after buy it, favorate some product

# product propirity

- have color and sizes and quantity in the stock

# store

- every store have link in the url with the name of their store
- have admin and products
- store id , store name

# promo code

- to be applied in certain product to reduce its price

## GPT command for schema

create drizzle schema for e-commerce sass app which have this feature:

- store that have admin and products
- product which have every product have title, description, price, discounted price, category, brand name,rating, tag like new or hot, admin, store, reviewed number, Number of purchases, properties
- properties is describe the product size, color and number of items with this property in the stoke and the one product can have many proprieties
- user who can rate or favorite specific product after buy it. also the user can be admin and cerate stores so make sure you add roles enum for that
- promo code be applied in certain product to reduce its price

notice that what i give to you is just feature i want you to add and not a tables and tables keys so you can name the keys for the tables as you want starting from this code:
`
import { pgTable, uuid, text, varchar, date, timestamp } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
id: uuid("id").defaultRandom().primaryKey().notNull(),
name: varchar("name", { length: 255 }).notNull(),
username: varchar("user_name", { length: 256 }).notNull().unique(),
email: varchar("email", { length: 255 }).notNull().unique(),
password: text("password"),
emailVerified: timestamp("email_verified"),
bio: text("bio"),
image: text("image"),
dateOfBirth: date("date_of_birth"),
});
`
