"use client";

import { Checkbox } from "@/components/ui/checkbox";
import useProductFilterKeys from "@/hooks/use-product-filter-keys";
import useUpdateSearchParams from "@/hooks/use-update-search-params";

type props = {
  colors: { color: string }[];
};

export default function ColorFilter({ colors }: props) {
  const { color } = useProductFilterKeys();
  const { updateSearchParams } = useUpdateSearchParams();

  return (
    <div className="p-4 border-b ">
      <p className="font-bold text-base mb-4">Color</p>

      <div className="flex items-center flex-wrap gap-3">
        {colors.map(({ color: curColor }) => (
          <div key={curColor} className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox checked={curColor === color} onCheckedChange={(checked) => updateSearchParams({ color: checked ? curColor : undefined })} id="terms" className={"bg-background border-0 rounded-full size-6"} style={{ backgroundColor: curColor }} />
          </div>
        ))}
      </div>
    </div>
  );
}
