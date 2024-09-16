import client from "@/server/client";
import CategoryFilter from "./category-filter";
import ColorFilter from "./color-filter";
import PriceFilter from "./price-filter";
import TagFilter from "./tag-filter";
import { requestData } from "@/lib/server/request-data";
import BrandFilter from "./brand-filter";

export default async function ProductFiltersSidebar() {
  const categoriesRes = await requestData(client.api.v1.category, "$get");
  const brandsRes = await requestData(client.api.v1.brand, "$get");

  if (categoriesRes.isError || brandsRes.isError) return <div>something went wrong while fetching the data.</div>;

  return (
    <div className="bg-muted border rounded-md flex-shrink-0 w-[260px] min-h-[60vh]">
      {categoriesRes.data.length > 0 && <CategoryFilter categories={categoriesRes.data} />}
      {brandsRes.data.length > 0 && <BrandFilter brands={brandsRes.data} />}
      <ColorFilter />
      <PriceFilter />
      <TagFilter />
    </div>
  );
}
