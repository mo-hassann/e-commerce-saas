"use client";
import ReactImageMagnifier from "simple-image-magnifier/react";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format-money";
import Image from "next/image";
import useIsMountain from "@/hooks/use-mountain";
import { cn } from "@/lib/utils";
import client from "@/server/client";
import { InferResponseType } from "hono";
import ProductPropertyForm from "./product-property-form";

type props = {
  product: Extract<InferResponseType<(typeof client.api.v1.products)[":productId"]["$get"]>, { data: any }>["data"];
};

export default function ProductDetails({ product }: props) {
  const isMountain = useIsMountain();
  const discount = product.oldPrice ? Math.round(Math.abs(1 - +product.price / +product.oldPrice) * 100) : undefined;
  return (
    <div className="flex gap-6">
      <div className="flex-1 flex gap-3">
        <ul className="flex flex-col gap-3">
          <li className="rounded-md overflow-hidden">
            <Image className="size-full object-cover object-center" width={100} height={100} src={"/product.jpg"} alt="product" />
          </li>
          <li className="rounded-md overflow-hidden">
            <Image className="size-full object-cover object-center" width={100} height={100} src={"/product.jpg"} alt="product" />
          </li>
          <li className="rounded-md overflow-hidden">
            <Image className="size-full object-cover object-center" width={100} height={100} src={"/product.jpg"} alt="product" />
          </li>
        </ul>
        <div className="w-full rounded-md overflow-hidden">
          <ReactImageMagnifier srcPreview={"/product.jpg"} srcOriginal={"/product.jpg"} width="100%" height="auto" className={cn("w-full", !isMountain && "blur-sm")} />
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-5xl font-bold mb-3">{product.name}</h1>
        <div className="flex gap-5">
          {product.brand && (
            <p className="capitalize font-semibold text-muted-foreground">
              Brand: <span className="text-primary">{product.brand}</span>
            </p>
          )}
          {product.category && (
            <p className="capitalize font-semibold text-muted-foreground">
              Category: <span className="text-primary">{product.category}</span>
            </p>
          )}
        </div>
        <Separator className="my-4" />
        <div className="flex items-center gap-3">
          <span className="text-3xl text-primary font-semibold">{formatCurrency(+product.price)}</span>
          {product.oldPrice && (
            <>
              <span className="line-through text-muted-foreground">{formatCurrency(+product.oldPrice)}</span>
              <span>{discount}% off</span>
            </>
          )}
        </div>
        <Separator className="my-4" />
        <p>{product.description}</p>

        <ProductPropertyForm />
      </div>
    </div>
  );
}
