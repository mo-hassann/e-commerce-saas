import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import useBrandSheet from "@/hooks/dashboard/use-brand-sheet";
import BrandForm from "../forms/brand-form";

export default function BrandSheet() {
  const { isOpen, onClose, id, name } = useBrandSheet();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="h-full">
        <SheetHeader>
          <SheetTitle>Brand Items</SheetTitle>
        </SheetHeader>

        <BrandForm id={id} name={name} />
      </SheetContent>
    </Sheet>
  );
}
