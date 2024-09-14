"use client";

import ProductCard from "@/components/product/product-card";
import useGetProducts from "@/query-hooks/product/use-get-products";

export default function ProductsContainer() {
  const productsQuery = useGetProducts({});

  if (productsQuery.isLoading || productsQuery.isPending) return <div>loading...</div>;
  if (productsQuery.isError) return <div>error: {JSON.stringify(productsQuery.error)}</div>;

  console.log(productsQuery.data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {productsQuery.data.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
