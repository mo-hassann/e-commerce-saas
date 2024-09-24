"use client";

import { DataTable } from "./data-table";
import Spinner from "@/components/global/spinner";
import { columns } from "./columns";
import useGetTags from "@/query-hooks/tags/use-get-tags";

export default function TagsPage() {
  const tagsQuery = useGetTags();

  if (tagsQuery.isPending || tagsQuery.isLoading) return <Spinner />;

  if (tagsQuery.isError) return <div>error</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-3">Tags</h1>
      <DataTable columns={columns} data={tagsQuery.data} />
    </div>
  );
}
