import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";
import { handleErrors } from "@/lib/server/errors";
import { InferResponseType } from "hono";

const $get = client.api.v1.products["dashboard-products"].$get;

type resT = InferResponseType<typeof $get>;

export type DashboardProductsResType = Extract<resT, { data: any }>["data"][0];

export default function useGetDashboardProducts() {
  const query = useQuery({
    queryKey: ["dashboard_products"],
    queryFn: async () => {
      const res = await $get();

      // handle throw the error response
      if (!res.ok) throw await handleErrors(res);

      const { data } = await res.json();

      return data;
    },
  });

  return query;
}
