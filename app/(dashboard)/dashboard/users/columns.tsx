"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useUserSheet from "@/hooks/dashboard/use-user-sheet";
import useConfirm from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import useDeleteUsers from "@/query-hooks/dashboard/delete-users";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string | null;
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: () => <div className="text-center">Amount</div>,
    cell: ({ row }) => {
      const amount = (row.getValue("image") as string) || null;
      const username = row.getValue("username") as string;
      return (
        <Avatar className="size-9 mx-auto">
          <AvatarImage src={amount || "/user.png"} />
          <AvatarFallback>{username?.slice(0, 2)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
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
      const emailVerified = (row.getValue("name") as string) || null;
      return <span className="capitalize ml-5">{emailVerified}</span>;
    },
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Email Verified
        </Button>
      );
    },
    cell: ({ row }) => {
      const emailVerified = (row.getValue("emailVerified") as string) || null;
      return <span className={cn("bg-red-500 p-1.5 rounded-full text-white text-xs ml-5", !!emailVerified && "bg-green-500")}>{!!emailVerified ? "Verified" : "Not Verified"}</span>;
    },
  },
  {
    id: "actions",
    header: function Header({ table }) {
      const users = table.getFilteredSelectedRowModel();
      const userIds = users.rows.map((row) => row.original.id);

      const deleteUsersMutation = useDeleteUsers();
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
              <DropdownMenuItem disabled={userIds.length === 0} onClick={async () => (await confirm()) && deleteUsersMutation.mutate({ ids: userIds })} className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-none">
                Delete Users
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
    cell: function Cell({ row }) {
      const user = row.original;
      const deleteUsersMutation = useDeleteUsers();
      const userSheet = useUserSheet();
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
                  navigator.clipboard.writeText(user.id);
                  toast.success("ID copied successfully.");
                }}
              >
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => userSheet.onOpen(user.id)}>Edit User</DropdownMenuItem>
              <DropdownMenuItem onClick={async () => (await confirm()) && deleteUsersMutation.mutate({ ids: [user.id] })} className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-none">
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
