import { ShoppingBasket, X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

export default function AlertBar() {
  return (
    <div className="bg-foreground text-background py-1.5">
      <div className="container capitalize text-sm flex items-center gap-2">
        <ShoppingBasket size={16} />
        <p className="block mx-auto lg:ml-0">new discounts because you are a new user</p>
        <Button className="p-0 size-auto" size="icon" variant="ghost">
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}
