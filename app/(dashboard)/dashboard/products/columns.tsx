"use client";

import ProductRating from "@/components/product/product-rating";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useProductSheet from "@/hooks/dashboard/use-product-sheet";
// import useProductSheet from "@/hooks/dashboard/use-product-sheet";
import useConfirm from "@/hooks/use-confirm";
import { formatCurrency } from "@/lib/format-money";
import { cn } from "@/lib/utils";
import useDeleteProducts from "@/query-hooks/product/use-delete-products";
import { DashboardProductsResType } from "@/query-hooks/product/use-get-dashboard-products";

// import useDeleteProducts from "@/query-hooks/products/use-delete-products";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

export const columns: ColumnDef<DashboardProductsResType>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const productImage = (row.getValue("image") as string) || null;

      return (
        <div className="size-16 mx-auto rounded-md overflow-hidden shadow-sm">
          <Image className="size-full" width={50} height={150} src={productImage || "/product.jpg"} alt={row.getValue("name")} />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Name
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = (row.getValue("name") as string) || null;
      return <span className="capitalize ml-5 truncate">{name}</span>;
    },
  },
  {
    accessorKey: "brand",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Brand
        </Button>
      );
    },
    cell: ({ row }) => {
      const brand = (row.getValue("brand") as string) || null;
      return !!brand ? <span className={"p-1.5 rounded-full bg-muted border text-xs ml-5"}>{brand}</span> : <span className="ml-8">------</span>;
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Category
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = (row.getValue("category") as string) || null;
      return !!category ? <span className={"p-1.5 rounded-full bg-muted border text-xs ml-5"}>{category}</span> : <span className="ml-8">------</span>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Price
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.getValue("price") as string;
      return <span className="capitalize ml-5">{formatCurrency(+price)}</span>;
    },
  },
  {
    accessorKey: "oldPrice",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Old Price
        </Button>
      );
    },
    cell: ({ row }) => {
      const oldPrice = (row.getValue("oldPrice") as string) || null;

      return !!oldPrice ? <span className="capitalize ml-5">{formatCurrency(+oldPrice)}</span> : <span className="ml-8">------</span>;
    },
  },

  {
    accessorKey: "reviewedNumber",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Reviewed Number
        </Button>
      );
    },
    cell: ({ row }) => {
      const reviewedNumber = (row.getValue("reviewedNumber") as number) || 0;
      return <span className="capitalize mx-auto block w-fit">{reviewedNumber}</span>;
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Rating
        </Button>
      );
    },
    cell: ({ row }) => {
      const rating = (row.getValue("rating") as string) || 0;
      return <ProductRating className="ml-5" rating={+rating} size={15} />;
    },
  },
  {
    accessorKey: "purchases",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Purchases
        </Button>
      );
    },
    cell: ({ row }) => {
      const purchases = (row.getValue("purchases") as number) || 0;
      return <span className="capitalize mx-auto block w-fit">{purchases}</span>;
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Stock
        </Button>
      );
    },
    cell: ({ row }) => {
      const stock = (row.getValue("stock") as string) || null;
      return !!stock ? <span className="capitalize ml-5">{stock}</span> : <span className="capitalize ml-5 italic text-nowrap text-muted-foreground">not specified</span>;
    },
  },
  {
    accessorKey: "lastUpdate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Last Update
        </Button>
      );
    },
    cell: ({ row }) => {
      const lastUpdate = (row.getValue("lastUpdate") as string) || null;
      return !!lastUpdate ? <span className="capitalize ml-5">{new Date(lastUpdate).toDateString()}</span> : <span className="capitalize ml-5 italic text-nowrap text-muted-foreground">not specified</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Created At
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = (row.getValue("createdAt") as string) || null;
      return !!createdAt ? <span className="capitalize ml-5">{new Date(createdAt).toDateString()}</span> : <span className="capitalize ml-5 italic text-nowrap text-muted-foreground">not specified</span>;
    },
  },

  {
    id: "actions",
    header: function Header({ table }) {
      const products = table.getFilteredSelectedRowModel();
      const productsIds = products.rows.map((row) => row.original.id);

      const deleteProductsMutation = useDeleteProducts();
      const [ConfirmationDialog, confirm] = useConfirm();

      return (
        <React.Fragment>
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
              <DropdownMenuItem disabled={productsIds.length === 0} onClick={async () => (await confirm()) && deleteProductsMutation.mutate({ ids: productsIds })} className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-none">
                Delete Products
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </React.Fragment>
      );
    },
    cell: function Cell({ row }) {
      const product = row.original;
      const deleteProductsMutation = useDeleteProducts();
      const productSheet = useProductSheet();
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
                  navigator.clipboard.writeText(product.id);
                  toast.success("ID copied successfully.");
                }}
              >
                Copy Product ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => productSheet.onOpen(product.id)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={async () => (await confirm()) && deleteProductsMutation.mutate({ ids: [product.id] })} className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-none">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
