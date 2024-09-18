"use client";

import useToggleProductFavorite from "@/query-hooks/product/use-toggle-product-favorite";
import { Button } from "../ui/button";
import { FaHeart } from "react-icons/fa6";
import useGetUserFavoriteProducts from "@/query-hooks/product/use-get-user-favorite-products";
import Spinner from "../global/spinner";
import { cn } from "@/lib/utils";

interface props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  productId: string;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

export default function FavoriteProductBtn({ productId, className, size }: props) {
  const favoriteProductMutation = useToggleProductFavorite();
  const favoriteQuery = useGetUserFavoriteProducts();

  if (favoriteQuery.isLoading || favoriteQuery.isPending) return <Spinner />;
  if (favoriteQuery.isError) return;

  const isFavorited = !!favoriteQuery.data.find((product) => product.id === productId);

  return (
    <Button className={cn(className, "hover:text-red-600", isFavorited && "text-red-500")} variant="outline" onClick={() => favoriteProductMutation.mutate({ productId })} size={size}>
      <FaHeart size={18} />
    </Button>
  );
}
