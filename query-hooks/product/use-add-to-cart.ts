import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type cartItem = {
  id: string;
  quantity: number;
  name: string;
  price: string;
  oldPrice?: string;
  color?: { id: string; color: string };
  size?: { id: string; size: string };
  image?: string;
};

export default function useAddToCart() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (item: cartItem) => {
      debugger;
      const cart: cartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

      const existItemIndex = cart.findIndex((i) => i.id === item.id && i.color?.id === item.color?.id && i.size?.id === item.size?.id);

      // if the item exist in the cart with the same color and the same size then: only update the quantity
      if (existItemIndex !== -1) {
        const [existItem] = cart.splice(existItemIndex, 1);
        const updatedItem: cartItem = { ...existItem, quantity: existItem.quantity + item.quantity };
        cart.push(updatedItem);
      } else {
        cart.push(item);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      return new Promise((res) => res("success"));
    },
    onSuccess: () => {
      toast.success("item added to cart");
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
