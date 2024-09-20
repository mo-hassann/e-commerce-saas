import db from "@/db";
import { storeTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { MiddlewareHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { headers } from "next/headers";

declare module "hono" {
  interface ContextVariableMap {
    store: { id: string; storeName: string };
  }
}

export function curStore(): MiddlewareHandler {
  return async (c, next) => {
    try {
      const headersList = headers();
      const host = headersList.get("host"); // to get domain
      console.log(host, "-------------------------------- host");
      /*       // const host = c.req.header("host");
      if (!host) {
        const res = new Response("no host", {
          status: 400,
        });
        throw new HTTPException(400, { res });
      }
      const [subdomain] = host.split(".");
      // If the user is not in the main route (no subdomain case)
      if (subdomain === new URL(process.env.NEXT_PUBLIC_APP_URL!).host) {
        const res = new Response("wrong host", {
          status: 403,
        });
        throw new HTTPException(403, { res });
      }
      const [store] = await db.select({ id: storeTable.id, storeName: storeTable.storeName }).from(storeTable).where(eq(storeTable.storeName, subdomain));

      if (!store) {
        const res = new Response("no store", {
          status: 404,
        });
        throw new HTTPException(404, { res });
      }

      c.set("store", store); */

      await next();
    } catch (error: any) {
      console.log(error.message);
      console.log(error, "--------------------------------error");
      const res = new Response("no store", {
        status: 400,
      });
      throw new HTTPException(400, { res });
    }
  };
}
