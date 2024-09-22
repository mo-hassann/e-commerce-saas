"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import FavoriteProductBtn from "./favorite-product-btn";
import { cartItem } from "@/query-hooks/product/cart/use-add-to-cart";
import AddToCartBtn from "./add-to-cart-btn";

type properties = {
  properties: {
    colors: {
      id: string;
      color: string;
    }[];
    sizes: {
      id: string;
      size: string;
    }[];
  };
  product: Omit<cartItem, "size" | "quantity" | "color">;
};

export default function AddToCartProductForm({ properties: { colors, sizes }, product }: properties) {
  const [activeColorId, setActiveColorId] = useState<string>(colors[0]?.id);
  const [activeSizeId, setActiveSizeId] = useState<string>(sizes[0]?.id);
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="space-y-4 my-3">
      {/* color component */}
      {colors.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="font-semibold">Color:</span>
          {colors.map((color) => {
            const isActive = activeColorId === color.id;
            return <button onClick={() => setActiveColorId(color.id)} key={color.id} style={{ background: color.color }} className={cn("size-6 rounded-full", isActive && "outline outline-2 outline-offset-2 outline-primary")} />;
          })}
        </div>
      )}
      {/* size component */}
      {sizes.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="font-semibold">Size:</span>
          {sizes.map((size) => {
            const isActive = activeSizeId === size.id;
            return (
              <Button size="sm" onClick={() => setActiveSizeId(size.id)} variant={"outline"} key={size.id} className={cn("rounded-sm", isActive && "bg-primary border-primary text-white hover:bg-primary hover:text-white")}>
                {size.size}
              </Button>
            );
          })}
        </div>
      )}
      {/* add to card component */}
      <div className="flex items-center gap-3 py-4">
        <Input className="w-20 text-lg" type="number" value={quantity} onChange={(e) => setQuantity(+e.target.value >= 1 ? +e.target.value : 1)} />
        <AddToCartBtn item={{ id: product.id, name: product.name, price: product.price, quantity, color: colors.find((color) => color.id === activeColorId), size: sizes.find((size) => size.id === activeSizeId), image: product.image, oldPrice: product.oldPrice }} />
        <FavoriteProductBtn productId={product.id} />
      </div>
    </div>
  );
}
