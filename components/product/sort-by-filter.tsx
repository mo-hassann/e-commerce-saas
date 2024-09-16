import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useProductFilterKeys from "@/hooks/use-product-filter-keys";
import useUpdateSearchParams from "@/hooks/use-update-search-params";

export default function SortByFilter() {
  const { sortBy } = useProductFilterKeys();
  const { updateSearchParams } = useUpdateSearchParams();
  const filters = [
    { id: "POPULAR", name: "popular" },
    { id: "HIGH_PRICE", name: "price: high to low" },
    { id: "LOW_PRICE", name: "price: low to high" },
    { id: "NEWEST", name: "newest arrivals" },
  ];

  return (
    <div className="ml-auto">
      <Select defaultValue={sortBy} value={sortBy} onValueChange={(newValue) => updateSearchParams({ sortBy: newValue })}>
        <SelectTrigger className="w-[180px] capitalize">
          <SelectValue placeholder="Sort By.." />
        </SelectTrigger>
        <SelectContent>
          {filters.map((filter) => (
            <SelectItem key={filter.id} className="capitalize" value={filter.id}>
              {filter.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
