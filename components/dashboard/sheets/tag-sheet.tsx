import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import useTagSheet from "@/hooks/dashboard/use-tag-sheet";
import TagForm from "../forms/tag-form";

export default function TagSheet() {
  const { isOpen, onClose, id, name } = useTagSheet();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="h-full">
        <SheetHeader>
          <SheetTitle>Tag Items</SheetTitle>
        </SheetHeader>

        <TagForm id={id} name={name} />
      </SheetContent>
    </Sheet>
  );
}
