import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";
import { handleErrors } from "@/lib/server/errors";

const $get = client.api.v1.category.$get;

export default function useGetCategories() {
  const query = useQuery({
    queryKey: ["categories"],
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
