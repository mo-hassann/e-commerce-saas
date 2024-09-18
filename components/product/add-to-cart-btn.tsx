import React from "react";
import { Button } from "../ui/button";
import useAddToCard, { cartItem } from "@/query-hooks/product/cart/use-add-to-cart";

type props = {
  item: cartItem;
};

export default function AddToCartBtn({ item }: props) {
  const addToCardMutation = useAddToCard();
  return (
    <Button className="w-32" onClick={() => addToCardMutation.mutate({ ...item })}>
      Add To Card
    </Button>
  );
}
