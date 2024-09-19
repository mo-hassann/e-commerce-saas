"use client";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, X } from "lucide-react";
import React, { useState } from "react";

export default function AlertBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return;

  return (
    <div className="bg-foreground text-background py-1.5">
      <div className="container capitalize text-sm flex items-center gap-2">
        <ShoppingBasket size={16} />
        <p className="block mx-auto lg:ml-0">new discounts because you are a new user</p>
        <Button onClick={() => setIsVisible(false)} className="p-0 size-auto" size="icon" variant="ghost">
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}
