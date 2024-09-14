import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";
import { handleErrors } from "@/lib/server/errors";
import { InferRequestType } from "hono";

const $get = client.api.v1.products[":productId"].$get;

type reqT = InferRequestType<typeof $get>["param"];

export default function useGetProduct(values: reqT) {
  const query = useQuery({
    queryKey: ["product", values.productId],
    queryFn: async () => {
      const res = await $get({ param: { ...values } });

      // handle throw the error response
      if (!res.ok) throw await handleErrors(res);

      const { data } = await res.json();

      return data;
    },
    enabled: !!values.productId,
  });

  return query;
}
