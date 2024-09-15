import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/auth/current-user";
import { AvatarImage } from "@radix-ui/react-avatar";
import Link from "next/link";

export default async function UserBtn() {
  const user = await currentUser();
  return user ? (
    <Avatar className="size-9">
      <AvatarImage src={user.image || "/user.png"} />
      <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
    </Avatar>
  ) : (
    <Link href="/sign-in">
      <Button>sing in</Button>
    </Link>
  );
}
