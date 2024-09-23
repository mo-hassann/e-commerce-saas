import { handleErrors } from "@/lib/server/errors";
import client from "@/server/client";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { InferResponseType } from "hono";
import { toast } from "sonner";

const $delete = client.api.v1.dashboard.users.$delete;

type ResType = InferResponseType<typeof $delete>;
type ReqType = InferRequestType<typeof $delete>["json"];

export default function useDeleteUsers() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResType, Error, ReqType>({
    mutationFn: async ({ ids }) => {
      const res = await $delete({ json: { ids } });

      // handle throw the error response
      if (!res.ok) throw await handleErrors(res);

      const data = await res.json();

      return data;
    },
    onSuccess: async (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(res.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message || "something went wrong");
    },
  });

  return mutation;
}
