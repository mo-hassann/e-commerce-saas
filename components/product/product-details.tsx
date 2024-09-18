import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format-money";
import client from "@/server/client";
import { InferResponseType } from "hono";
import ProductImagesPreviewer from "./product-images-previewer";
import AddToCardProductForm from "./add-to-card-product-form";

type props = {
  product: Extract<InferResponseType<(typeof client.api.v1.products)[":productId"]["$get"]>, { data: any }>["data"];
};

export default function ProductDetails({ product }: props) {
  const discount = product.oldPrice ? Math.round(Math.abs(1 - +product.price / +product.oldPrice) * 100) : undefined;
  return (
    <div className="flex gap-6">
      <ProductImagesPreviewer images={product.productImages.length > 0 ? product.productImages : [{ id: "1", url: "/product.jpg" }]} />

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

        <AddToCardProductForm properties={product.properties} productId={product.id} />
      </div>
    </div>
  );
}
