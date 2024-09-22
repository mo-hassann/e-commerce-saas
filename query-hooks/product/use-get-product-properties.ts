import { useQuery } from "@tanstack/react-query";
import client from "@/server/client";
import { handleErrors } from "@/lib/server/errors";
import { InferRequestType } from "hono";

const $get = client.api.v1["product-properties"].$get;

export default function useGetProductProperties() {
  const query = useQuery({
    queryKey: ["product_properties"],
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
