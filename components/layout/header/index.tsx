import React from "react";
import Logo from "./logo";
import SearchBar from "./search-bar";
import UserBtn from "./user-btn";
import CardBtn from "./card-btn";
import WhishListBtn from "./wish-list-btn";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  return (
    <div className="w-full border-b py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <SearchBar />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-4 mx-3">
            <CardBtn />
            <WhishListBtn />
          </div>
          <Separator className="h-10" orientation="vertical" />
          <UserBtn />
        </div>
      </div>
    </div>
  );
}
