"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AddToCardBtn from "./add-to-card-btn";

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
};

export default function ProductPropertyForm({ properties: { colors, sizes } }: properties) {
  const [activeColorId, setActiveColorId] = useState<string>(colors[0].id);
  const [activeSizeId, setActiveSizeId] = useState<string>(sizes[0].id);
  const [quantity, setQuantity] = useState(1);
  return (
    <div className="space-y-4 my-3">
      {/* color component */}
      <div className="flex items-center gap-3">
        <span className="font-semibold">Color:</span>
        {colors.map((color) => {
          const isActive = activeColorId === color.id;
          return <button onClick={() => setActiveColorId(color.id)} key={color.id} style={{ background: color.color }} className={cn("size-6 rounded-full", isActive && "outline outline-2 outline-offset-2 outline-primary")} />;
        })}
      </div>
      {/* size component */}
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

      <div className="flex items-center gap-3 py-4">
        <Input className="w-20 text-lg" type="number" value={quantity} onChange={(e) => setQuantity(+e.target.value >= 0 ? +e.target.value : 0)} />
        <AddToCardBtn />
      </div>
    </div>
  );
}

/* 

      
*/
