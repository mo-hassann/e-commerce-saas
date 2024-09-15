import { Button } from "@/components/ui/button";
import { FaCartShopping } from "react-icons/fa6";

export default function CardBtn() {
  return (
    <Button variant="ghost" size="icon" className="relative size-auto hover:bg-transparent hover:text-primary">
      <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center bg-primary rounded-full size-3.5 text-white text-xs">1</div>
      <FaCartShopping size={24} />
    </Button>
  );
}
