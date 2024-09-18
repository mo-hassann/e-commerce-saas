"use client";
import { Button } from "@/components/ui/button";
import useCartSheet from "@/hooks/product/use-cart-sheet";
import useGetCartItems from "@/query-hooks/product/use-get-cart-items";
import { FaCartShopping } from "react-icons/fa6";

export default function CartBtn() {
  const cartItems = useGetCartItems();
  const cartItemsCount = cartItems.data?.length;
  const { onOpen } = useCartSheet();
  return (
    <Button onClick={onOpen} variant="ghost" size="icon" className="relative size-auto hover:bg-transparent hover:text-primary">
      {!!cartItemsCount && <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-primary rounded-full size-3.5 text-white text-xs">{cartItemsCount}</div>}
      <FaCartShopping size={24} />
    </Button>
  );
}
