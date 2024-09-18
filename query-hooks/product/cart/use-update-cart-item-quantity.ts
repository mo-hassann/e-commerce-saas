import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartBasic } from "./use-remove-from-cart";
import { cartItem } from "./use-add-to-cart";

type props = {
  item: cartBasic;
  newQuantity: number;
};

export default function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ item, newQuantity }: props) => {
      const cart: cartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

      const updatedItems = cart.map((curItem) => {
        if (curItem.id === item.id && curItem.color?.id === item.colorId && curItem.size?.id === item.sizeId) {
          return { ...curItem, quantity: newQuantity };
        } else {
          return curItem;
        }
      });

      localStorage.setItem("cart", JSON.stringify(updatedItems));

      return new Promise((res) => res("success"));
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
