import { NextAuthConfig } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { signInFormSchema } from "./validators/forms";

import bcrypt from "bcryptjs";
import { getUserWithEmail } from "./lib/auth/user";

import Google from "next-auth/providers/google";

export default {
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      authorize: async (credentials) => {
        const validatedFields = signInFormSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          // check email exist before sign in with data
          const user = await getUserWithEmail(email);

          if (!user || !user.password) return null;

          const isPasswordMatch = bcrypt.compareSync(password, user.password);

          if (!isPasswordMatch) {
            return null;
          }

          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Your sign-in logic here
        return true; // Allow sign-in
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false; // Deny sign-in
      }
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "USER" | "ADMIN";
      return session;
    },
  },
} satisfies NextAuthConfig;
