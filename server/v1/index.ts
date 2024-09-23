import { Hono } from "hono";

import auth from "./auth";
import test from "./test";
import products from "./products";
import category from "./category";
import tag from "./tag";
import brand from "./brand";
import productProperties from "./product-properties";
import dashboard from "./dashboard";

const app = new Hono();

const routes = app /*  */
  .route("/auth", auth)
  .route("/test", test)
  .route("/products", products)
  .route("/category", category)
  .route("/tag", tag)
  .route("/brand", brand)
  .route("/product-properties", productProperties)
  .route("/dashboard", dashboard);

export default routes;
