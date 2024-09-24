"use client";

import { DataTable } from "./data-table";
import Spinner from "@/components/global/spinner";
import { columns } from "./columns";
import useGetBrands from "@/query-hooks/brands/use-get-brands";

export default function BrandsPage() {
  const brandsQuery = useGetBrands();

  if (brandsQuery.isPending || brandsQuery.isLoading) return <Spinner />;

  if (brandsQuery.isError) return <div>error</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-3">Brands</h1>
      <DataTable columns={columns} data={brandsQuery.data} />
    </div>
  );
}
