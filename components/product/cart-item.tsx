import { cartItem } from "@/query-hooks/product/use-add-to-cart";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/format-money";
import useRemoveFromCart from "@/query-hooks/product/use-remove-from-cart";

type props = {
  item: cartItem;
};

export default function CartItem({ item }: props) {
  return (
    <div className="bg-muted rounded-md border relative flex items-center gap-5 p-3">
      <RemoveFromCartBtn id={item.id} colorId={item.color?.id} sizeId={item.size?.id} />
      <div className="rounded-md border">
        <Image width={100} height={100} src={item.image || "/product.jpg"} alt={item.name} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-lg font-bold">{item.name}</p>
        <p>
          <span className="font-extrabold">{formatCurrency(+item.price)}</span> <span className="text-primary font-semibold">x{item.quantity}</span>
        </p>
        <div className="flex items-center gap-2">
          {item.color && (
            <p className="flex items-center gap-1">
              color: <span className="size-4 rounded-full border inline-flex" style={{ background: item.color.color }} />
            </p>
          )}
          {item.size && (
            <p className="flex items-center gap-1">
              size: <span className="size-7 border rounded-md flex items-center justify-center font-bold">{item.size.size}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

type RemoveFromCartBtnProps = {
  id: string;
  colorId?: string;
  sizeId?: string;
};

const RemoveFromCartBtn = ({ colorId, id, sizeId }: RemoveFromCartBtnProps) => {
  const removeItemMutation = useRemoveFromCart();
  return (
    <Button className="absolute -top-1.5 -right-1.5 size-4" size="icon" onClick={() => removeItemMutation.mutate({ colorId, id, sizeId })} variant="destructive">
      <X size={12} />
    </Button>
  );
};
