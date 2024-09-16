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
  const productPropertiesRes = await requestData(client.api.v1["product-properties"], "$get");
  const tagsRes = await requestData(client.api.v1.tag, "$get");

  if (categoriesRes.isError || brandsRes.isError || productPropertiesRes.isError || tagsRes.isError) return <div>something went wrong while fetching the data.</div>;

  return (
    <div className="bg-muted border rounded-md flex-shrink-0 w-[260px] min-h-[60vh]">
      {categoriesRes.data.length > 0 && <CategoryFilter categories={categoriesRes.data} />}
      {brandsRes.data.length > 0 && <BrandFilter brands={brandsRes.data} />}
      {productPropertiesRes.data.colors.length > 0 && <ColorFilter colors={productPropertiesRes.data.colors} />}
      <PriceFilter />
      {tagsRes.data.length > 0 && <TagFilter tags={tagsRes.data} />}
    </div>
  );
}
