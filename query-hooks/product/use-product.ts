import { handleErrors } from "@/lib/server/errors";
import client from "@/server/client";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { InferResponseType } from "hono";
import { toast } from "sonner";

const $post = client.api.v1.products.$post;

type ResType = InferResponseType<typeof $post>;
type ReqType = InferRequestType<typeof $post>["json"];

export default function useProduct() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResType, Error, ReqType>({
    mutationFn: async (values) => {
      const res = await $post({ json: values });

      // handle throw the error response
      if (!res.ok) throw await handleErrors(res);

      const data = await res.json();

      return data;
    },
    onSuccess: async (res: any, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard_products"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["products", id] });
      }
      toast.success(res.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "something went wrong");
    },
  });

  return mutation;
}
