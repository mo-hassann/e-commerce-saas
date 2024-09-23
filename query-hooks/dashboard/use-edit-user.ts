import { handleErrors } from "@/lib/server/errors";
import client from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { InferResponseType } from "hono";
import { toast } from "sonner";

const $patch = client.api.v1.dashboard["edit-user"].$patch;

type ResType = InferResponseType<typeof $patch>;
type ReqType = InferRequestType<typeof $patch>["json"];

export default function useEditUser() {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResType, Error, ReqType>({
    mutationFn: async (user) => {
      const res = await $patch({ json: user });

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
