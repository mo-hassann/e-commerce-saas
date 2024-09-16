"use client";

import { Checkbox } from "@/components/ui/checkbox";
import useProductFilterKeys from "@/hooks/use-product-filter-keys";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { useEffect, useState } from "react";

type props = {
  brands: { id: string; name: string }[];
};

export default function BrandFilter({ brands }: props) {
  const { brandIds } = useProductFilterKeys();
  const { updateSearchParams } = useUpdateSearchParams();
  const [activeItems, setActiveItems] = useState<string[]>(brandIds ? brandIds.split("|") : []);

  useEffect(() => {
    updateSearchParams({ brandIds: activeItems.reduce((acc, item) => (acc ? `${acc}|${item}` : item), "") });
  }, [activeItems, updateSearchParams]);

  return (
    <div className="p-4 border-b ">
      <p className="font-bold text-base mb-4">Brand</p>

      <div className="space-y-2">
        {brands.map((brand) => (
          <div key={brand.id} className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox
              checked={activeItems?.includes(brand.id)}
              onCheckedChange={(checked) => (checked ? setActiveItems((curState) => [...curState, brand.id]) : setActiveItems((curState) => [...curState.filter((id) => id !== brand.id)]))}
              id="terms"
              className="bg-background border-border data-[state=checked]:border-primary"
            />
            <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {brand.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
