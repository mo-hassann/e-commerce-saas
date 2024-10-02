import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";
import { handleErrors } from "@/lib/server/errors";
import { InferRequestType } from "hono";
import { InferResponseType } from "hono";

const $get = client.api.v1.products.$get;

export type productReqT = InferRequestType<typeof $get>["query"];
type resT = InferResponseType<typeof $get>;

export type getProductsResType = Extract<resT, { data: any }>["data"][0];

export default function useGetProducts(values: productReqT) {
  const query = useQuery({
    queryKey: ["products", values],
    queryFn: async () => {
      const res = await $get({ query: { ...values } });

      // handle throw the error response
      if (!res.ok) throw await handleErrors(res);

      const { data } = await res.json();

      return data;
    },
  });

  return query;
}
