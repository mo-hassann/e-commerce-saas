import { Hono } from "hono";

import test from "./test";
import products from "./products";
import auth from "./auth";

const app = new Hono();

const routes = app /*  */
  .route("/test", test)
  .route("/products", products)
  .route("/auth", auth);

export default routes;
