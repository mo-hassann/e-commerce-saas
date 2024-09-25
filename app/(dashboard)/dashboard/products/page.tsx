"use client";

import { DataTable } from "./data-table";
import Spinner from "@/components/global/spinner";
import { columns } from "./columns";
import useGetDashboardProducts from "@/query-hooks/product/use-get-dashboard-products";

export default function ProductsPage() {
  const productsQuery = useGetDashboardProducts();

  if (productsQuery.isPending || productsQuery.isLoading) return <Spinner />;

  if (productsQuery.isError) return <div>error</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-3">Products</h1>
      <DataTable columns={columns} data={productsQuery.data} />
    </div>
  );
}
