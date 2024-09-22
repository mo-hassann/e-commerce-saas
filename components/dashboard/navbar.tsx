"use client";
import Link from "next/link";
import { Airplay, BringToFront, Home, ShoppingCart, Tag, UserRoundCogIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Users", href: "/dashboard/users", icon: UserRoundCogIcon },
  { label: "Products", href: "/dashboard/products", icon: ShoppingCart },
  { label: "Categories", href: "/dashboard/categories", icon: BringToFront },
  { label: "Tags", href: "/dashboard/tags", icon: Tag },
  { label: "Brands", href: "/dashboard/brands", icon: Airplay },
];

export default function Navbar() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className="flex flex-col gap-3">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`/dashboard/${link.href}`);
        return (
          <Link key={link.href} href={link.href} className={cn("size-9 rounded-full flex items-center justify-center hover:bg-muted", isActive && "text-white bg-primary hover:bg-primary")}>
            <link.icon size={18} />
          </Link>
        );
      })}
    </div>
  );
}
