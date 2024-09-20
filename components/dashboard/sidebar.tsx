import Logo from "../layout/header/logo";

import UserBtn from "../layout/header/user-btn";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full items-center justify-between px-3 py-5 bg-background border-r">
      <Logo />
      <Navbar />
      <UserBtn />
    </div>
  );
}
