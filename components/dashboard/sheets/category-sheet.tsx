import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import useCategorySheet from "@/hooks/dashboard/use-category-sheet";
import CategoryForm from "../forms/category-form";

export default function CategorySheet() {
  const { isOpen, onClose, id, name } = useCategorySheet();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="h-full">
        <SheetHeader>
          <SheetTitle>Category Items</SheetTitle>
        </SheetHeader>

        <CategoryForm id={id} name={name} />
      </SheetContent>
    </Sheet>
  );
}
