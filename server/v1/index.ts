import { Hono } from "hono";

import test from "./test";
import products from "./products";
import category from "./category";
import auth from "./auth";

const app = new Hono();

const routes = app /*  */
  .route("/auth", auth)
  .route("/test", test)
  .route("/products", products)
  .route("/category", category);

export default routes;
