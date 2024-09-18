"use client";

import { Button } from "@/components/ui/button";
import useProductFilterKeys from "@/hooks/product/use-product-filter-keys";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type props = {
  tags: { id: string; name: string }[];
};

export default function TagFilter({ tags }: props) {
  const { tagIds } = useProductFilterKeys();
  const { updateSearchParams } = useUpdateSearchParams();
  const [activeItems, setActiveItems] = useState<string[]>(tagIds ? tagIds.split("|") : []);

  useEffect(() => {
    updateSearchParams({ tagIds: activeItems.reduce((acc, item) => (acc ? `${acc}|${item}` : item), "") });
  }, [activeItems, updateSearchParams]);

  return (
    <div className="p-4">
      <p className="font-bold text-base mb-4">Tag</p>

      <div className="flex items-center flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = activeItems.includes(tag.id);
          return (
            <Button
              key={tag.id}
              variant="outline"
              size="sm"
              onClick={() => (isActive ? setActiveItems((curState) => [...curState.filter((id) => id !== tag.id)]) : setActiveItems((curState) => [...curState, tag.id]))}
              className={cn(isActive && "bg-primary text-white border-primary hover:bg-primary hover:text-white hover:opacity-60")}
            >
              {tag.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
