"use client";

import BrandSheet from "@/components/dashboard/sheets/brand-sheet";
import CategorySheet from "@/components/dashboard/sheets/category-sheet";
import TagSheet from "@/components/dashboard/sheets/tag-sheet";
import UserSheet from "@/components/dashboard/sheets/user-sheet";
import CartSheet from "@/components/product/cart-sheet";

export default function SheetProvider() {
  return (
    <>
      <CartSheet />
      <UserSheet />
      <CategorySheet />
      <BrandSheet />
      <TagSheet />
    </>
  );
}
