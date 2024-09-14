import { ExternalLink, Heart, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { getProductsResType } from "@/query-hooks/product/use-get-products";

export default function ProductCard({ id, name, brandId, categoryId, colors, oldPrice, price, purchases, rating, reviewedNumber, sizes, stock, tagId }: getProductsResType) {
  return (
    <div className="w-full h-auto p-3.5 rounded-lg border hover:shadow-md">
      <div className="rounded-lg overflow-hidden group relative cursor-pointer shadow-inner">
        <div className="rounded-lg w-full h-[300px] overflow-hidden">
          <Image className="size-full object-cover object-center group-hover:scale-125 transition duration-1000" width={100} height={100} src={"/product.bmp"} alt="product" />
        </div>
        <div className="absolute top-3 left-3 bg-secondary rounded-sm flex items-center justify-center h-5 w-auto px-3 capitalize text-sm text-white">hot</div>
        <div className="absolute bottom-0 w-full h-1/2 bg-[linear-gradient(0deg,#000,transparent)] opacity-0 group-hover:opacity-30" />
        <div className="flex items-center justify-center gap-3 absolute bottom-0 w-full p-5 z-10 opacity-0 group-hover:opacity-100">
          <Button className="rounded-full text-muted-foreground bg-white hover:bg-primary hover:text-white shadow-sm translate-y-9 group-hover:translate-y-0 transition-all" size="icon">
            <Heart size={18} />
          </Button>
          <Button className="rounded-full text-muted-foreground bg-white hover:bg-primary hover:text-white shadow-sm translate-y-9 group-hover:translate-y-0 transition-all" size="icon">
            <ShoppingBasket size={18} />
          </Button>
          <Button className="rounded-full text-muted-foreground bg-white hover:bg-primary hover:text-white shadow-sm translate-y-9 group-hover:translate-y-0 transition-all" size="icon">
            <ExternalLink size={18} />
          </Button>
        </div>
      </div>
      <div className="py-3 px-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground capitalize">pottle</span>
          <span>
            *({rating}) ({reviewedNumber})
          </span>
        </div>
        <h2 className="capitalize font-semibold">{name}</h2>

        <div className="flex items-center gap-2">
          <span className="font-bold text-primary text-lg">${price}</span>
          {oldPrice && <span className="text-sm line-through text-muted-foreground">${oldPrice}</span>}
        </div>
        <Button className="border-primary text-primary hover:bg-primary hover:text-white" variant="outline">
          view product
        </Button>
      </div>
    </div>
  );
}
