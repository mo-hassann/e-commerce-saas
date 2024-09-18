import { cartItem } from "@/query-hooks/product/cart/use-add-to-cart";
import { Button } from "../ui/button";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/format-money";
import useRemoveFromCart, { cartBasic } from "@/query-hooks/product/cart/use-remove-from-cart";
import useUpdateCartItemQuantity from "@/query-hooks/product/cart/use-update-cart-item-quantity";

type props = {
  item: cartItem;
};

export default function CartItem({ item }: props) {
  const updateQuantityMutation = useUpdateCartItemQuantity();
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
        <div className="flex items-center gap-3">
          {item.color && (
            <p className="flex items-center gap-1">
              color: <span className="size-4 rounded-full inline-flex" style={{ background: item.color.color }} />
            </p>
          )}
          {item.size && (
            <p className="flex items-center gap-1">
              size: <span className="size-6 border rounded-md flex items-center justify-center font-semibold bg-background text-sm">{item.size.size}</span>
            </p>
          )}
        </div>
        <div className="flex items-center border size-fit bg-background text-lg rounded-lg h-7 overflow-hidden">
          <Button size="icon" className="w-7 h-full p-0 rounded-none" variant="ghost" onClick={() => updateQuantityMutation.mutate({ item: { id: item.id, colorId: item.color?.id, sizeId: item.size?.id }, newQuantity: item.quantity + 1 })}>
            <Plus size={16} />
          </Button>
          <p className="px-3">{item.quantity}</p>
          <Button size="icon" className="w-7 h-full p-0 rounded-none" variant="ghost" disabled={item.quantity - 1 < 1} onClick={() => updateQuantityMutation.mutate({ item: { id: item.id, colorId: item.color?.id, sizeId: item.size?.id }, newQuantity: item.quantity - 1 })}>
            <Minus size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

const RemoveFromCartBtn = ({ colorId, id, sizeId }: cartBasic) => {
  const removeItemMutation = useRemoveFromCart();
  return (
    <Button className="absolute -top-1.5 -right-1.5 size-4" size="icon" onClick={() => removeItemMutation.mutate({ colorId, id, sizeId })} variant="destructive">
      <X size={12} />
    </Button>
  );
};
