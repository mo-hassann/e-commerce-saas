"use client";
import { Input } from "@/components/ui/input";
import useProductFilterKeys from "@/hooks/product/use-product-filter-keys";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const { searchKey } = useProductFilterKeys();
  const router = useRouter();
  const pathname = usePathname();
  const { updateSearchParams } = useUpdateSearchParams();
  const [inputValue, setInputValue] = useState(searchKey ?? "");

  const isSearchPage = pathname === "/search";

  useEffect(() => {
    if (!isSearchPage) setInputValue("");
  }, [isSearchPage]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.trim() === "") {
      updateSearchParams({ searchKey: null });
      return;
    }

    if (isSearchPage) {
      // Update URL params if already on search page
      updateSearchParams({ searchKey: inputValue });
    } else {
      // Redirect to search page if not already there
      router.push(`/search?searchKey=${encodeURIComponent(inputValue)}`);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <form onSubmit={handleSearch} className="sm:flex hidden items-center py-1 px-2 rounded-md overflow-hidden border w-64 h-10 has-[:focus]:ring-2 has-[:focus]:border-transparent ring-primary/70">
      <Input placeholder="Search..." value={inputValue} onChange={(e) => handleInputChange(e.target.value)} className="disabled:opacity-50 p-0 px-3 rounded-none border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
      <Search size={18} />
    </form>
  );
}
