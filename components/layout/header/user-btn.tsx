import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth/current-user";
import { AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import SignOutBtn from "@/components/auth/sign-out-btn";

export default async function UserBtn() {
  const user = await currentUser();
  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-9">
          <AvatarImage src={user.image || "/user.png"} />
          <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <SignOutBtn className="text-destructive hover:text-destructive font-bold size-fit text-left  flex gap-1 relative  cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          <LogOut size={16} /> Sign Out
        </SignOutBtn>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link href="/sign-in">
      <Button>sing in</Button>
    </Link>
  );
}
