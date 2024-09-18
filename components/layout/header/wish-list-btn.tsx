"use client";
import { Button } from "@/components/ui/button";
import useGetUserFavoriteProducts from "@/query-hooks/product/use-get-user-favorite-products";
import Link from "next/link";
import { FaHeart } from "react-icons/fa6";

export default function WhishListBtn() {
  const favoriteQuery = useGetUserFavoriteProducts();

  const favoriteProductsCount = favoriteQuery.data?.length;

  return (
    <Link href="/products/wish-list" className="inline-flex">
      <Button variant="ghost" size="icon" className="relative size-auto hover:bg-transparent hover:text-primary">
        {!!favoriteProductsCount && <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-primary rounded-full size-3.5 text-white text-xs">{favoriteProductsCount}</div>}
        <FaHeart size={24} />
      </Button>
    </Link>
  );
}
