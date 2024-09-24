"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useBrandSheet from "@/hooks/dashboard/use-brand-sheet";
import useConfirm from "@/hooks/use-confirm";

import useDeleteBrands from "@/query-hooks/brands/use-delete-brands";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export type Brand = {
  id: string;
  name: string;
};

export const columns: ColumnDef<Brand>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Brand
        </Button>
      );
    },
  },

  {
    id: "actions",
    header: function Header({ table }) {
      const brands = table.getFilteredSelectedRowModel();
      const brandsIds = brands.rows.map((row) => row.original.id);

      const deleteBrandsMutation = useDeleteBrands();
      const [ConfirmationDialog, confirm] = useConfirm();

      return (
        <>
          <ConfirmationDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem disabled={brandsIds.length === 0} onClick={async () => (await confirm()) && deleteBrandsMutation.mutate({ ids: brandsIds })} className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-none">
                Delete Brands
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
    cell: function Cell({ row }) {
      const brand = row.original;
      const deleteBrandsMutation = useDeleteBrands();
      const brandSheet = useBrandSheet();
      const [ConfirmationDialog, confirm] = useConfirm();

      return (
        <>
          <ConfirmationDialog />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(brand.id);
                  toast.success("ID copied successfully.");
                }}
              >
                Copy Brand ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => brandSheet.onOpen(brand.name, brand.id)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={async () => (await confirm()) && deleteBrandsMutation.mutate({ ids: [brand.id] })} className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-none">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
