"use client";
import useProductFilterKeys from "@/hooks/product/use-product-filter-keys";
import useUpdateSearchParams from "@/hooks/use-update-search-params";
import { cn } from "@/lib/utils";
import useGetCategories from "@/query-hooks/categories/use-get-categories";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const categoryQuery = useGetCategories();
  const { categoryIds } = useProductFilterKeys();
  const { updateSearchParams } = useUpdateSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  if (categoryQuery.isLoading || categoryQuery.isPending || categoryQuery.isError) return;

  return (
    <nav className="w-full bg-muted/40">
      <ul className="container flex items-center justify-center gap-10 py-3 uppercase font-semibold text-foreground">
        {categoryQuery.data.map((category) => {
          const isActive = categoryIds?.split("|")?.[0] === category.id;

          const handleClick = () => {
            if (pathname === "/search") {
              updateSearchParams({ categoryIds: category.id });
            } else {
              router.push(`/search?categoryIds=${category.id}`);
            }
          };
          return (
            <li onClick={handleClick} key={category.id} className={cn("flex items-center gap-1 cursor-pointer hover:text-primary", isActive && "text-primary")}>
              <span className={cn("block size-1.5 border border-muted-foreground/40 rounded-full", isActive && "border-primary font-extrabold")} />
              {category.name}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
