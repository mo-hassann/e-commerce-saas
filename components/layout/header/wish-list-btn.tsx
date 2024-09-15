import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa6";

export default function WhishListBtn() {
  return (
    <Button variant="ghost" size="icon" className="relative size-auto hover:bg-transparent hover:text-primary">
      <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-primary rounded-full size-3.5 text-white text-xs">1</div>
      <FaHeart size={24} />
    </Button>
  );
}
