import { useQuery } from "@tanstack/react-query";
import { cartItem } from "./use-add-to-cart";

export default function useGetCartItems() {
  const query = useQuery({
    queryKey: ["cart_items"],
    queryFn: () => {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]") as cartItem[];

      return cartItems;
    },
  });

  return query;
}
