"use client";

import { DataTable } from "./data-table";
import Spinner from "@/components/global/spinner";
import { columns } from "./columns";
import useGetCategories from "@/query-hooks/categories/use-get-categories";

export default function CategoriesPage() {
  const categoriesQuery = useGetCategories();

  if (categoriesQuery.isPending || categoriesQuery.isLoading) return <Spinner />;

  if (categoriesQuery.isError) return <div>error</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-3">Categories</h1>
      <DataTable columns={columns} data={categoriesQuery.data} />
    </div>
  );
}
