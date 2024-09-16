"use client";
// @ts-ignore
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import "@/styles/range-slider.css";

import useProductFilterKeys from "@/hooks/use-product-filter-keys";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { useEffect, useState } from "react";
import useIsMountain from "@/hooks/use-mountain";
import Spinner from "@/components/global/spinner";
import { formatCurrency } from "@/lib/format-money";

export default function ColorFilter() {
  const isMountain = useIsMountain();
  const { minPrice, maxPrice } = useProductFilterKeys();
  const { updateSearchParams } = useUpdateSearchParams();

  const [minValue, setMinValue] = useState(minPrice ? +minPrice : 1);
  const [maxValue, setMaxValue] = useState(maxPrice ? +maxPrice : 1000);

  const minRangeValue = 1;
  const maxRangeValue = 50_000;

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateSearchParams({ minPrice: minValue, maxPrice: maxValue });
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
          <RangeSlider
            min={minRangeValue}
            max={maxRangeValue}
            step={1}
            defaultValue={[minValue, maxValue]}
            value={[minValue, maxValue]}
            onInput={([min, max]: [number, number]) => {
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
