"use client";

import useProductFilterKeys from "@/hooks/product/use-product-filter-keys";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { useEffect, useState } from "react";
import useIsMountain from "@/hooks/use-mountain";
import Spinner from "@/components/global/spinner";
import { formatCurrency } from "@/lib/format-money";
import { Slider } from "@/components/ui/slider";

export default function PriceFilter() {
  const isMountain = useIsMountain();
  const { minPrice, maxPrice } = useProductFilterKeys();
  const { updateSearchParams } = useUpdateSearchParams();

  const minRangeValue = 1;
  const maxRangeValue = 50_000;

  const defaultMinValue = 1;
  const defaultMaxValue = 25_000;

  const [minValue, setMinValue] = useState(minPrice ? +minPrice : defaultMinValue);
  const [maxValue, setMaxValue] = useState(maxPrice ? +maxPrice : defaultMaxValue);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateSearchParams({
        minPrice: minValue === defaultMinValue ? null : minValue,
        maxPrice: maxValue === defaultMaxValue ? null : maxValue,
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [minValue, maxValue, updateSearchParams]);

  return (
    <div className="p-4 border-b ">
      <p className="font-bold text-base mb-4">Price</p>

      {isMountain ? (
        <div className="space-y-7">
          <div className="bg-white p-2 text-center rounded-md font-bold border">
            {formatCurrency(minValue)} - {formatCurrency(maxValue)}
            {maxValue === maxRangeValue && "+"}
          </div>
          <Slider
            min={minRangeValue}
            max={maxRangeValue}
            step={1}
            defaultValue={[minValue, maxValue]}
            value={[minValue, maxValue]}
            onValueChange={([min, max]) => {
              setMinValue(min);
              setMaxValue(max);
            }}
          />
        </div>
      ) : (
        <Spinner className="w-full" />
      )}
    </div>
  );
}
