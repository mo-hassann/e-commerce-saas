import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";
import { handleErrors } from "@/lib/server/errors";
import { InferRequestType } from "hono";

const $get = client.api.v1.products.interactions.$get;

type reqT = InferRequestType<typeof $get>["query"];

export default function useGetProductInteractions(values: reqT) {
  const query = useQuery({
    queryKey: ["product_interactions", values.productId],
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
