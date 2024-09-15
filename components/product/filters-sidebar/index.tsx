import client from "@/server/client";
import CategoryFilter from "./category-filter";
import ColorFilter from "./color-filter";
import PriceFilter from "./price-filter";
import TagFilter from "./tag-filter";
import { requestData } from "@/lib/server/request-data";

export default async function ProductFiltersSidebar() {
  const categoriesRes = await requestData(client.api.v1.category, "$get");

  if (categoriesRes.isError) return <div>{categoriesRes.errorMessage}</div>;

  return (
    <div className="bg-muted border rounded-md flex-shrink-0 w-[260px] min-h-[60vh]">
      <CategoryFilter categories={categoriesRes.data} />
      <ColorFilter />
      <PriceFilter />
      <TagFilter />
    </div>
  );
}
