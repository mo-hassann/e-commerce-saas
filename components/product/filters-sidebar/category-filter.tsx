"use client";

import { Checkbox } from "@/components/ui/checkbox";
import useProductFilterKeys from "@/hooks/product/use-product-filter-keys";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { useEffect, useState } from "react";

type props = {
  categories: { id: string; name: string }[];
};

export default function CategoryFilter({ categories }: props) {
  const { categoryIds } = useProductFilterKeys();
  const { updateSearchParams } = useUpdateSearchParams();
  const [activeItems, setActiveItems] = useState<string[]>(categoryIds ? categoryIds.split("|") : []);

  useEffect(() => {
    updateSearchParams({ categoryIds: activeItems.reduce((acc, item) => (acc ? `${acc}|${item}` : item), "") });
  }, [activeItems, updateSearchParams]);

  return (
    <div className="p-4 border-b ">
      <p className="font-bold text-base mb-4">Category</p>

      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox
              checked={activeItems?.includes(category.id)}
              onCheckedChange={(checked) => (checked ? setActiveItems((curState) => [...curState, category.id]) : setActiveItems((curState) => [...curState.filter((id) => id !== category.id)]))}
              id="terms"
              className="bg-background border-border data-[state=checked]:border-primary"
            />
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {category.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
