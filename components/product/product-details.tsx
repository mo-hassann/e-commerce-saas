"use client";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format-money";
import ProductImagesPreviewer from "./product-images-previewer";
import AddToCartProductForm from "./add-to-cart-product-form";
import ProductRating from "./product-rating";
import useGetProduct from "@/query-hooks/product/use-get-product";
import Spinner from "../global/spinner";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
import { Suspense } from "react";

type props = {
  productId: string;
};

export default function ProductDetails({ productId }: props) {
  const productQuery = useGetProduct({ productId });

  if (productQuery.isPending || productQuery.isLoading) return <Spinner />;
  if (productQuery.isError) return <div>something went wrong while fetching the data.</div>;

  const product = productQuery.data;

  const discount = product.oldPrice ? Math.round(Math.abs(1 - +product.price / +product.oldPrice) * 100) : undefined;

  return (
    <div className="flex gap-6">
      <ProductImagesPreviewer images={product.productImages.length > 0 ? product.productImages : [{ id: "1", url: "/product.jpg" }]} />

      <div className="flex-1">
        <h1 className="text-5xl font-bold mb-1">{product.name}</h1>
        {product.rating && <ProductRating className="mb-3" rating={+product.rating} reviewedNumber={product.reviewedNumber} />}
        <div className="flex gap-5">
          {product.brand && (
            <p className="capitalize font-semibold text-muted-foreground">
              Brand: <span className="text-primary">{product.brand.name}</span>
            </p>
          )}
          {product.category && (
            <p className="capitalize font-semibold text-muted-foreground">
              Category: <span className="text-primary">{product.category.name}</span>
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
        {product.description && (
          <Suspense fallback={"loading..."}>
            <ReactQuill value={product.description} readOnly={true} theme={"bubble"} className="[&_.ql-editor]:text-[1.05rem]" />
          </Suspense>
        )}
        <AddToCartProductForm properties={product.properties} product={{ id: product.id, image: product.productImages[0]?.url, name: product.name, oldPrice: product.oldPrice || undefined, price: product.price }} />
      </div>
    </div>
  );
}
