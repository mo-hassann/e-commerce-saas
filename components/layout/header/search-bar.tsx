"use client";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

export default function SearchBar() {
  return (
    <div className="sm:flex hidden items-center py-1 px-2 rounded-md overflow-hidden border w-64 h-10 has-[:focus]:ring-2 has-[:focus]:border-transparent ring-primary/70">
      <Input placeholder="Search..." className="disabled:opacity-50 p-0 px-3 rounded-none border-none focus-visible:ring-0 focus-visible:ring-offset-0" />
      <Search size={18} />
    </div>
  );
}
