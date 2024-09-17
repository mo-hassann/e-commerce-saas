import { pgEnum } from "drizzle-orm/pg-core";

// Roles enum for user
export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);

// Enum for product size
export const sizeEnum = pgEnum("size", ["XS", "S", "M", "L", "XL", "XXL"]);

// Enum for product color
export const colorEnum = pgEnum("color", [
  "red",
  "crimson",
  "tomato",
  "salmon",
  "orange",
  "gold",
  "yellow",
  "chartreuse",
  "lime",
  "green",
  "olive",
  "teal",
  "cyan",
  "aqua",
  "turquoise",
  "azure",
  "blue",
  "navy",
  "indigo",
  "violet",
  "plum",
  "orchid",
  "fuchsia",
  "magenta",
  "lavender",
  "black",
  "white",
  "beige",
  "brown",
  "coral",
  "ivory",
  "khaki",
  "maroon",
  "silver",
  "tan",
  "sienna",
  "gray",
  "darkgray",
  "lightgray",
  "dimgray",
  "slategray",
  "darkslategray",
  "lightslategray",
  "wheat",
]);

// types
export type RoleT = (typeof roleEnum.enumValues)[number];
export type SizeT = (typeof sizeEnum.enumValues)[number];
export type ColorT = (typeof colorEnum.enumValues)[number];
