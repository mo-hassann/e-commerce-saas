"use client";

import CategorySheet from "@/components/dashboard/sheets/category-sheet";
import UserSheet from "@/components/dashboard/sheets/user-sheet";
import CartSheet from "@/components/product/cart-sheet";

export default function SheetProvider() {
  return (
    <>
      <CartSheet />
      <UserSheet />
      <CategorySheet />
    </>
  );
}
