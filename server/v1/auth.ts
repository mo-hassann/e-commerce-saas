import db from "@/db";
import { userTable } from "@/db/schemas";
import { signInFormSchema, signUpFormSchema } from "@/validators/forms";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";

import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { generateRandomUserName } from "@/lib/auth/user";
import { isRedirectError } from "next/dist/client/components/redirect";
import { curStore } from "@/lib/server/get-cur-store";

const app = new Hono()
  .post("/sign-up", curStore(), zValidator("json", signUpFormSchema), async (c) => {
    try {
      const user = c.req.valid("json");
      const store = c.get("store");

      // check if the email already exists in the store
      const [existingUser] = await db
        .select({ id: userTable.id })
        .from(userTable)
        .where(and(eq(userTable.storeId, store.id), eq(userTable.email, user.email)));

      if (existingUser) return c.json({ errorMessage: "user with this email already exist" }, 400);

      if (existingUser) {
        return c.json({ errorMessage: "user with this email is already exist" }, 400);
      }

      // create random unique user name because it require in the db and user can change this userName in their profile after registration and login successfully
      const username = generateRandomUserName(user.name);

      // hash the password before send it to the db
      const hashedPassword = bcrypt.hashSync(user.password, 8);

      // add the user to the db
      await db
        .insert(userTable)
        .values({ ...user, storeId: store.id, username, password: hashedPassword })
        .returning({ name: userTable.name });

      return c.json({ message: "user added successfully" });
    } catch (error: any) {
      console.log(error);
      return c.json({ errorMessage: "field to register the user", cause: error?.message }, 400);
    }
  })
  .post("/sign-in", zValidator("json", signInFormSchema), async (c) => {
    try {
      const values = c.req.valid("json");

      // try to sign the user in using Auth js
      await signIn("credentials", { ...values, redirect: false });

      return c.json({ message: "user signed in successfully" });
    } catch (error: any) {
      if (isRedirectError(error)) {
        throw error;
      }
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return c.json({ errorMessage: "email or password is not correct", cause: error?.message }, 400);
          case "CallbackRouteError":
            return c.json({ errorMessage: "email or password is not correct", cause: error?.message }, 400);

          default:
            return c.json({ errorMessage: "something went wrong.", cause: error?.message }, 400);
        }
      }
      return c.json({ errorMessage: "unknown error", cause: error?.message }, 400);
    }
  })
  .post("/sign-out", async (c) => {
    try {
      await signOut({ redirect: false });

      return c.json({ message: "user signed out successfully" });
    } catch (error: any) {
      if (isRedirectError(error)) {
        throw error;
      }
      return c.json({ errorMessage: "something went wrong" }, 400);
    }
  });

export default app;
