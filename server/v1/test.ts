import { getAuthUser, verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { curStore } from "@/lib/server/get-cur-store";

const app = new Hono()
  .get("/auth-needed", verifyAuth(), async (c) => {
    const auth = c.get("authUser");
    return c.json({ auth, data: "some data that required the user to be authorized" });
  })
  .get("/", zValidator("query", z.object({ name: z.string().optional() })), (c) => {
    const query = c.req.valid("query");
    return c.json({ message: "this is public route!", query });
  })
  .post("/", zValidator("json", z.object({ arg1: z.boolean() })), (c) => {
    try {
      const { arg1 } = c.req.valid("json");
      if (arg1) throw new Error();

      return c.json({ message: "this is post route!", data: "some data for the post method", arg1 });
    } catch (error) {
      return c.json({ errorMessage: "something went wrong" }, 400);
    }
  });

export default app;
