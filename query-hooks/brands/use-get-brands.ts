import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";
import { handleErrors } from "@/lib/server/errors";

const $get = client.api.v1.brand.$get;

export default function useGetBrands() {
  const query = useQuery({
    queryKey: ["brands"],
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
