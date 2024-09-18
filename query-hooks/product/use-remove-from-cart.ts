import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartItem } from "./use-add-to-cart";

type props = {
  id: string;
  colorId?: string;
  sizeId?: string;
};

export default function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, colorId, sizeId }: props) => {
      const cart: cartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

      const itemIndex = cart.findIndex((i) => i.id === id && i.color?.id === colorId && i.size?.id === sizeId);

      cart.splice(itemIndex, 1);

      localStorage.setItem("cart", JSON.stringify(cart));

      return new Promise((res) => res("success"));
    },
    onSuccess: () => {
      toast.success("item removed from cart");
    },
    onError: () => {
      toast.error("error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart_items"] });
    },
  });

  return mutation;
}
