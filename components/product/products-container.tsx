"use client";

import ProductCard from "@/components/product/product-card";
import useProductFilterKeys from "@/hooks/use-product-filter-keys";
import useGetProducts from "@/query-hooks/product/use-get-products";
import SortByFilter from "./sort-by-filter";

export default function ProductsContainer() {
  const filterKeys = useProductFilterKeys();

  return (
    <div className="flex items-center flex-col gap-3 w-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold capitalize">{filterKeys.searchKey ? `${filterKeys.searchKey}...` : "explore products"}</h1>
        <SortByFilter />
      </div>
      <Products />
    </div>
  );
}

const Products = () => {
  const filterKeys = useProductFilterKeys();
  const productsQuery = useGetProducts({ ...filterKeys });

  if (productsQuery.isLoading || productsQuery.isPending) return <div>loading...</div>;
  if (productsQuery.isError) return <div>error: {JSON.stringify(productsQuery.error)}</div>;
  if (productsQuery.data.length === 0) return <div>no data</div>;

  return productsQuery.data.map((product) => <ProductCard key={product.id} orientation="HORIZONTAL" product={{ ...product }} />);
};
