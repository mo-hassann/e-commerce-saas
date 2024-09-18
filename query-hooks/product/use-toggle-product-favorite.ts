import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import client from "@/server/client";
import { InferRequestType, InferResponseType } from "hono";
import { handleErrors } from "@/lib/server/errors";

const $post = client.api.v1.products.favorite.$post;

type resT = InferResponseType<typeof $post>;
type reqT = InferRequestType<typeof $post>["json"];

export default function useToggleProductFavorite() {
  const queryClient = useQueryClient();
  const mutation = useMutation<resT, Error, reqT>({
    mutationFn: async (values) => {
      const res = await $post({ json: { ...values } });

      // handle throw the error response
      if (!res.ok) throw await handleErrors(res);

      return await res.json();
    },
    onMutate: async (newQuery) => {
      await queryClient.cancelQueries({ queryKey: ["user_favorite_products"] });

      const prevQuery = queryClient.getQueryData<{ id: string }[]>(["user_favorite_products"]);

      const isExist = prevQuery?.find((q) => q.id === newQuery.productId);

      if (isExist) {
        queryClient.setQueryData<{ id: string }[]>(["user_favorite_products"], (old = []) => [...old.filter((query) => query.id !== newQuery.productId)]);
      } else {
        queryClient.setQueryData<{ id: string }[]>(["user_favorite_products"], (old = []) => [...old, { id: newQuery.productId }]);
      }

      return { prevQuery };
    },
    onSuccess: (res: any) => {
      toast.success("success");
    },
    onError: (error, newQuery, context: any) => {
      queryClient.setQueryData(["favorite_chapters_ids"], context?.prevQuery);
      toast.error("error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user_favorite_products"] });
    },
  });

  return mutation;
}
