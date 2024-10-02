"use client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ProductCard from "./product-card";
import Autoplay from "embla-carousel-autoplay";
import useGetProducts, { productReqT } from "@/query-hooks/product/use-get-products";

type props = {
  filterKeys: productReqT;
  sectionTitle: string;
  orientation: "VERTICAL" | "HORIZONTAL";
};

export default function ProductSection({ filterKeys, sectionTitle, orientation }: props) {
  const productsQuery = useGetProducts({ ...filterKeys });

  if (productsQuery.isLoading || productsQuery.isPending) return <div>loading...</div>;
  if (productsQuery.isError) return <div>error: {JSON.stringify(productsQuery.error)}</div>;
  if (productsQuery.data.length === 0) return;

  return (
    <Carousel
      opts={{
        loop: true,
        align: "start",
      }}
      plugins={[Autoplay({ delay: 2000 })]}
      className="w-full my-4"
    >
      <h1 className="text-3xl font-bold py-2">{sectionTitle}</h1>
      <CarouselContent>
        {productsQuery.data.map((product) => (
          <CarouselItem key={product.id} className="basis-auto">
            <div className="p-1">
              <ProductCard key={product.id} orientation={orientation} product={{ ...product }} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
