"use client";
import React from "react";
import { DataTable } from "./data-table";
import useGetUsers from "@/query-hooks/dashboard/get-users";
import Spinner from "@/components/global/spinner";
import { columns } from "./columns";

export default function UsersPage() {
  const userQuery = useGetUsers();

  if (userQuery.isPending || userQuery.isLoading) return <Spinner />;

  if (userQuery.isError) return <div>error</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-3">Users</h1>
      <DataTable columns={columns} data={userQuery.data} />
    </div>
  );
}
