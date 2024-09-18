import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";
import { handleErrors } from "@/lib/server/errors";
import { useSession } from "@/hooks/use-session";

export default function useGetUserFavoriteProducts() {
  const { session } = useSession();
  const query = useQuery({
    queryKey: ["user_favorite_products"],
    queryFn: async () => {
      const res = await client.api.v1.products.favorite.$get();

      // handle throw the error response
      if (!res.ok) throw await handleErrors(res);

      const { data } = await res.json();

      return data;
    },
    retry: !!session,
  });

  return query;
}
