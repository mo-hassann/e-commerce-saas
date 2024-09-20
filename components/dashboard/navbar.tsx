"use client";
import Link from "next/link";
import { Airplay, BringToFront, Home, ShoppingCart, Tag, UserRoundCogIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "", icon: Home },
  { label: "Users", href: "users", icon: UserRoundCogIcon },
  { label: "Products", href: "products", icon: ShoppingCart },
  { label: "Categories", href: "categories", icon: BringToFront },
  { label: "Tags", href: "tags", icon: Tag },
  { label: "Brands", href: "brands", icon: Airplay },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-3">
      {links.map((link) => {
        const isActive = pathname.endsWith(link.href);
        return (
          <Link key={link.href} href={link.href} className={cn("size-9 rounded-full flex items-center justify-center hover:bg-muted", isActive && "text-white bg-primary hover:bg-primary")}>
            <link.icon size={18} />
          </Link>
        );
      })}
    </div>
  );
}
