"use client";

import ProductCard from "@/components/product/product-card";
import useGetUserFavoriteProducts from "@/query-hooks/product/use-get-user-favorite-products";

export default function WishListPage() {
  const favoriteProductsQuery = useGetUserFavoriteProducts();

  if (favoriteProductsQuery.isLoading || favoriteProductsQuery.isPending) return <div>loading...</div>;
  if (favoriteProductsQuery.error) return <div>error.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Wish List</h1>
      <div className="grid grid-cols-1 auto-cols-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4 w-full">
        {favoriteProductsQuery.data.map((product) => (
          <ProductCard key={product.id} product={product} orientation="VERTICAL" />
        ))}
      </div>
    </div>
  );
}
