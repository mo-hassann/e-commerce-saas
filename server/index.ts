import { AuthConfig, initAuthConfig } from "@hono/auth-js";
import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import provider from "@/auth.config";
import { cors } from "hono/cors";
import v1 from "./v1";

const app = new Hono().basePath("/api");

app.all("*", logger());
app.use("*", initAuthConfig(getAuthConfig));
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ errorMessage: err.message, fullError: err }, 500);
});

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

const routes = app.route("/v1", v1);

export type AppType = typeof routes;
export default app;

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: c.env.AUTH_SECRET,
    ...provider,
  };
}
