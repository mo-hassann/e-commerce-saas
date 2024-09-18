"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Navbar() {
  const [activeId, setActiveId] = useState(1);
  const items = [
    { id: 1, name: "shirts" },
    { id: 2, name: "jeans" },
    { id: 3, name: "boxers" },
    { id: 4, name: "shirts" },
  ];
  return (
    <nav className="w-full bg-muted/40">
      <ul className="container flex items-center justify-center gap-10 py-3 uppercase font-semibold text-foreground">
        {items.map((item) => (
          <li onClick={() => setActiveId(item.id)} key={item.id} className={cn("flex items-center gap-1 cursor-pointer hover:text-primary", activeId === item.id && "text-primary")}>
            <span className={cn("block size-1.5 border border-muted-foreground/40 rounded-full", activeId === item.id && "border-primary font-extrabold")} />
            {item.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}
