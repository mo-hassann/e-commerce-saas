import db from "@/db";

import { Hono } from "hono";

import { and, eq, ne, inArray, sql } from "drizzle-orm";

import { curStore } from "@/lib/server/get-cur-store";
import { storeTable, userTable } from "@/db/schemas";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { verifyAuth } from "@hono/auth-js";
import { editUserFormSchema } from "@/validators/forms";

import bcrypt from "bcryptjs";

const app = new Hono()
  .get("/users/:id", zValidator("param", z.object({ id: z.string().uuid() })), curStore(), async (c) => {
    const store = c.get("store");
    const { id: userId } = c.req.valid("param");
    try {
      const [user] = await db
        .select({ id: userTable.id, username: userTable.username, name: userTable.name, email: userTable.email, emailVerified: userTable.emailVerified, image: userTable.image })
        .from(userTable)
        .where(and(eq(userTable.storeId, store.id), eq(userTable.id, userId)));

      if (!user) return c.json({ errorMessage: "User not found." }, 404);

      return c.json({ data: user });
    } catch (error: any) {
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  })
  .get("/users", curStore(), async (c) => {
    const store = c.get("store");
    try {
      const users = await db.select({ id: userTable.id, username: userTable.username, name: userTable.name, email: userTable.email, emailVerified: userTable.emailVerified, image: userTable.image }).from(userTable).where(eq(userTable.storeId, store.id));
      return c.json({ data: users });
    } catch (error: any) {
      return c.json({ errorMessage: "field to get users", cause: error.message, error }, 400);
    }
  })
  .delete("/users", curStore(), verifyAuth(), zValidator("json", z.object({ ids: z.array(z.string().uuid()) })), async (c) => {
    const store = c.get("store");
    const { ids } = c.req.valid("json");
    const { session } = c.get("authUser");
    const adminId = session.user?.id!;

    if (ids.includes(adminId)) return c.json({ errorMessage: "you can't delete yourself as you are the admin." }, 400);

    try {
      const usersToDelete = db.$with("users_to_delete").as(
        db
          .select({ id: userTable.id })
          .from(userTable)
          .leftJoin(storeTable, eq(userTable.storeId, store.id))
          .where(and(inArray(userTable.id, ids), eq(storeTable.adminId, adminId), ne(userTable.id, adminId)))
      );

      await db
        .with(usersToDelete)
        .delete(userTable)
        .where(inArray(userTable.id, sql`(select * from ${usersToDelete})`));

      return c.json({ message: "users deleted successfully" });
    } catch (error: any) {
      console.log(error);
      return c.json({ errorMessage: error.message, cause: error.cause, error }, 400);
    }
  })
  .patch("/edit-user", curStore(), verifyAuth(), zValidator("json", editUserFormSchema.and(z.object({ id: z.string().uuid() }))), async (c) => {
    try {
      const { session } = c.get("authUser");

      const adminId = session.user?.id!;
      const store = c.get("store");
      const user = c.req.valid("json");

      // check for the store is owned by the cur admin
      if (store.adminId !== adminId) return c.json({ errorMessage: "you have no permeation to edit this user" }, 400);

      // check if the email of the user is existing before updating
      const [existingUser] = await db
        .select({ id: userTable.id })
        .from(userTable)
        .where(and(eq(userTable.storeId, store.id), eq(userTable.email, user.email), ne(userTable.id, user.id)));

      if (existingUser) return c.json({ errorMessage: "email already exists for this store." }, 400);

      // update user
      await db
        .update(userTable)
        .set({ ...user })
        .where(and(eq(userTable.storeId, store.id), eq(userTable.id, user.id)));

      return c.json({ message: "user updated successfully" });
    } catch (error: any) {
      console.log(error);
      return c.json({ errorMessage: "field to register the user", cause: error?.message }, 400);
    }
  });

export default app;
