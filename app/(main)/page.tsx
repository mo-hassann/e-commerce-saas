"use client";
import Spinner from "@/components/global/spinner";
import ProductSection from "@/components/product/product-section";
import useGetCategories from "@/query-hooks/categories/use-get-categories";
import Image from "next/image";

export default function Home() {
  const categoriesQuery = useGetCategories();

  if (categoriesQuery.isPending || categoriesQuery.isLoading) return <Spinner />;

  if (categoriesQuery.isError) return <div>error</div>;
  return (
    <div className="p-6">
      <div className="w-full rounded-md overflow-hidden h-52">
        <Image className="size-full object-cover" width={300} height={300} src="/product-4.bmp" alt="home_img" />
      </div>
      {categoriesQuery.data.map((category, i) => (
        <ProductSection orientation={i % 2 === 0 ? "HORIZONTAL" : "VERTICAL"} key={category.id} sectionTitle={category.name} filterKeys={{ categoryIds: [category.id] }} />
      ))}
    </div>
  );
}
