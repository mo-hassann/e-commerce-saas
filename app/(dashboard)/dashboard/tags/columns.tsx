"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useTagSheet from "@/hooks/dashboard/use-tag-sheet";

import useConfirm from "@/hooks/use-confirm";

import useDeleteTags from "@/query-hooks/tags/use-delete-tags";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export type Tag = {
  id: string;
  name: string;
};

export const columns: ColumnDef<Tag>[] = [
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
          Tag
        </Button>
      );
    },
  },

  {
    id: "actions",
    header: function Header({ table }) {
      const tags = table.getFilteredSelectedRowModel();
      const tagsIds = tags.rows.map((row) => row.original.id);

      const deleteTagsMutation = useDeleteTags();
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
              <DropdownMenuItem disabled={tagsIds.length === 0} onClick={async () => (await confirm()) && deleteTagsMutation.mutate({ ids: tagsIds })} className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-none">
                Delete Tags
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
    cell: function Cell({ row }) {
      const tag = row.original;
      const deleteTagsMutation = useDeleteTags();
      const tagSheet = useTagSheet();
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
                  navigator.clipboard.writeText(tag.id);
                  toast.success("ID copied successfully.");
                }}
              >
                Copy Tag ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => tagSheet.onOpen(tag.name, tag.id)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={async () => (await confirm()) && deleteTagsMutation.mutate({ ids: [tag.id] })} className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-none">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
