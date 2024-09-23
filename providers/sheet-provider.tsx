"use client";

import UserSheet from "@/components/dashboard/user-sheet";
import CartSheet from "@/components/product/cart-sheet";

export default function SheetProvider() {
  return (
    <>
      <CartSheet />
      <UserSheet />
    </>
  );
}
