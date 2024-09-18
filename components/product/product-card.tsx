import { ExternalLink, Heart, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { getProductsResType } from "@/query-hooks/product/use-get-products";
import { cn } from "@/lib/utils";

import { Rating } from "react-simple-star-rating";
import Link from "next/link";
import FavoriteProductBtn from "./favorite-product-btn";
import ProductRating from "./product-rating";

type props = {
  product: getProductsResType;
  orientation: "VERTICAL" | "HORIZONTAL";
};

export default function ProductCard({ orientation = "VERTICAL", product }: props) {
  const discount = product.oldPrice ? Math.round(Math.abs(1 - +product.price / +product.oldPrice) * 100) : undefined;
  return (
    <div className={cn("w-[270px] h-auto flex flex-col p-3.5 rounded-lg border hover:shadow-md", orientation === "HORIZONTAL" && "gap-4 flex-row w-full")}>
      <div className="rounded-lg overflow-hidden group relative shadow-inner flex-shrink-0">
        <Link href={`/products/${product.id}`} className={cn("rounded-lg w-full h-[200px] overflow-hidden cursor-pointer block", orientation === "HORIZONTAL" && "w-[200px]")}>
          <Image className="size-full object-cover object-center group-hover:scale-125 group-hover:translate-y-7 transition duration-1000" width={100} height={100} src={"/product.jpg"} alt="product" />
        </Link>
        {discount && <div className="absolute top-3 left-3 bg-secondary rounded-sm flex items-center justify-center h-5 w-auto px-3 capitalize text-sm text-white">{discount}% off</div>}
        <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(0deg,#000,transparent)] opacity-0 group-hover:opacity-30" />
        <div className="flex items-center justify-center gap-3 absolute bottom-0 w-full p-5 z-10 opacity-0 group-hover:opacity-100">
          <FavoriteProductBtn productId={product.id} className="bg-white text-muted-foreground  border-transparent backdrop-blur-md rounded-full  shadow-sm translate-y-9 group-hover:translate-y-0 transition-all" size="icon" />
          <Link href={`/products/${product.id}`} target="_blank">
            <Button className="rounded-full bg-white text-muted-foreground  backdrop-blur-md hover:bg-primary hover:text-white shadow-sm translate-y-9 group-hover:translate-y-0 transition-all" size="icon">
              <ExternalLink size={18} />
            </Button>
          </Link>
        </div>
      </div>
      <Link href={`/products/${product.id}`} className="py-3 px-2 flex flex-col gap-1.5 w-full cursor-pointer">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground capitalize">pottle</span>
          {product.rating && <ProductRating rating={+product.rating} reviewedNumber={product.reviewedNumber} />}
        </div>
        <h2 className="capitalize font-semibold">{product.name}</h2>

        {orientation === "HORIZONTAL" && product.description && <p>{product.description}</p>}

        <div className="flex items-center gap-2">
          <span className="font-bold text-primary text-lg">${product.price}</span>
          {product.oldPrice && <span className="text-sm line-through text-muted-foreground">${product.oldPrice}</span>}
        </div>
        {orientation === "VERTICAL" && (
          <Button className="border-primary text-primary hover:bg-primary hover:text-white" variant="outline">
            view product
          </Button>
        )}
      </Link>
    </div>
  );
}
