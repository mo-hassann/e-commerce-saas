"use client";
import { Input } from "@/components/ui/input";
import useProductFilterKeys from "@/hooks/use-product-filter-keys";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function SearchBar() {
  const { searchKey } = useProductFilterKeys();
  const { updateSearchParams } = useUpdateSearchParams();
  const [search, setSearch] = useState(searchKey);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateSearchParams({ searchKey: search });
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);
  return (
    <div className="sm:flex hidden items-center py-1 px-2 rounded-md overflow-hidden border w-64 h-10 has-[:focus]:ring-2 has-[:focus]:border-transparent ring-primary/70">
      <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="disabled:opacity-50 p-0 px-3 rounded-none border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
      <Search size={18} />
    </div>
  );
}
