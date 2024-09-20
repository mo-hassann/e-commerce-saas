import { Hono } from "hono";
import { DEFAULT_SIGN_IN_REDIRECT, DEFAULT_SIGN_OUT_REDIRECT, LANDING_PAGE_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import db from "@/db";
import { storeTable } from "@/db/schemas";
import { eq } from "drizzle-orm";

import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from "hono/cookie";

const app = new Hono();

app.all("*", async (c) => {
  const session = await auth();

  const pathname = new URL(c.req.url).pathname;
  const isAuthenticated = !!session?.user;

  const isApiAuthRoute = apiAuthPrefix.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isApiAuthRoute) return NextResponse.next();

  if (isAuthRoute) {
    if (isAuthenticated) {
      return Response.redirect(new URL(DEFAULT_SIGN_IN_REDIRECT, c.req.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL(DEFAULT_SIGN_OUT_REDIRECT, c.req.url));
  }

  // Check for subdomain and store existence
  const host = c.req.header("host");

  if (host) {
    const [subdomain] = host.split(".");

    // If the user is not in the main route (no subdomain case)
    if (subdomain !== new URL(process.env.NEXT_PUBLIC_APP_URL!).host) {
      const [store] = await db.select({ id: storeTable.id }).from(storeTable).where(eq(storeTable.storeName, subdomain));

      if (store?.id) {
        const response = NextResponse.next();
        response.cookies.set("subdomain", subdomain, {
          httpOnly: false,
          sameSite: "strict",
        });
        return response;
      } else {
        // Redirect to error page if store does not exist
        return Response.error();
      }
    } else if (!pathname.startsWith(LANDING_PAGE_REDIRECT)) {
      return Response.redirect(new URL(LANDING_PAGE_REDIRECT, c.req.url));
    }
  }

  return NextResponse.next();
});

export default app;
