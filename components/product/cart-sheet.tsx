import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import useGetCartItems from "@/query-hooks/product/cart/use-get-cart-items";
import useCartSheet from "@/hooks/product/use-cart-sheet";
import CartItem from "./cart-item";
import { formatCurrency } from "@/lib/format-money";
import { Button } from "../ui/button";

export default function CartSheet() {
  const { isOpen, onClose } = useCartSheet();
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="h-full">
        <SheetHeader>
          <SheetTitle>Cart Items</SheetTitle>
        </SheetHeader>
        <CartItemsContainer />
      </SheetContent>
    </Sheet>
  );
}

const CartItemsContainer = () => {
  const cartItems = useGetCartItems();

  if (cartItems.isLoading || cartItems.isPending) return <div>loading...</div>;
  if (cartItems.isError) return <div>error.</div>;
  if (cartItems.data.length === 0) return <div>no data.</div>;

  const totalPrice = cartItems.data.reduce((acc, item) => acc + +item.price * item.quantity, 0);
  const totalOldPrice = cartItems.data.reduce((acc, item) => (item.oldPrice ? acc + +item.oldPrice * item.quantity : acc), 0);
  const discount = Math.round(Math.abs(1 - totalOldPrice / totalPrice) * 100);

  return (
    <div className="size-full flex flex-col">
      <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden size-full p-3">
        {cartItems.data.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className="p-3 border-t w-full font-semibold space-y-3">
        {!!totalOldPrice && (
          <>
            <p className="flex items-center justify-between">
              <span>Sub-Total:</span>
              <span className="text-muted-foreground line-through">{formatCurrency(totalOldPrice)}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>VAT ({discount}%):</span>
              <span className="text-destructive">{formatCurrency(totalOldPrice - totalPrice)}</span>
            </p>
          </>
        )}
        <p className="flex items-center justify-between">
          <span>Total:</span>
          <span>{formatCurrency(totalPrice)}</span>
        </p>
        <Button className="block ml-auto">Check Out</Button>
      </div>
    </div>
  );
};
