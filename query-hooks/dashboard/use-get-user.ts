import { useQuery } from "@tanstack/react-query";

import client from "@/server/client";
import { handleErrors } from "@/lib/server/errors";

const $get = client.api.v1.dashboard.users[":id"].$get;

export default function useGetUser(id?: string) {
  const query = useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const res = await $get({ param: { id: id } });

      // handle throw the error response
      if (!res.ok) throw await handleErrors(res);

      const { data } = await res.json();

      return data;
    },
    enabled: !!id,
  });

  return query;
}
