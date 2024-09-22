"use client";
import CategoryFilter from "./category-filter";
import ColorFilter from "./color-filter";
import PriceFilter from "./price-filter";
import TagFilter from "./tag-filter";
import BrandFilter from "./brand-filter";
import useGetCategories from "@/query-hooks/categories/use-get-categories";
import useGetBrands from "@/query-hooks/brands/use-get-brands";
import useGetProductProperties from "@/query-hooks/product/use-get-product-properties";
import useGetTags from "@/query-hooks/tags/use-get-tags";
import Spinner from "@/components/global/spinner";

export default function ProductFiltersSidebar() {
  const categoriesQuery = useGetCategories();
  const brandsQuery = useGetBrands();
  const productPropertiesQuery = useGetProductProperties();
  const tagsQuery = useGetTags();

  if (categoriesQuery.isLoading || categoriesQuery.isPending || brandsQuery.isLoading || brandsQuery.isPending || productPropertiesQuery.isPending || productPropertiesQuery.isLoading || tagsQuery.isLoading || tagsQuery.isPending) return <Spinner />;
  if (categoriesQuery.isError || brandsQuery.isError || productPropertiesQuery.isError || tagsQuery.isError) return <div>something went wrong while fetching the data.</div>;

  return (
    <div className="sticky top-4 bg-muted border rounded-md flex-shrink-0 w-[260px] h-fit">
      {categoriesQuery.data.length > 0 && <CategoryFilter categories={categoriesQuery.data} />}
      {brandsQuery.data.length > 0 && <BrandFilter brands={brandsQuery.data} />}
      {productPropertiesQuery.data.colors.length > 0 && <ColorFilter colors={productPropertiesQuery.data.colors} />}
      <PriceFilter />
      {tagsQuery.data?.length > 0 && <TagFilter tags={tagsQuery.data} />}
    </div>
  );
}
