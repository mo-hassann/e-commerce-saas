import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import useUserSheet from "@/hooks/dashboard/use-user-sheet";
import useGetUser from "@/query-hooks/dashboard/use-get-user";
import Spinner from "../global/spinner";
import NewUserForm from "./new-user-form";
import EditUserForm from "./edit-user-form";

export default function UserSheet() {
  const { isOpen, onClose, userId } = useUserSheet();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="h-full">
        <SheetHeader>
          <SheetTitle>User Items</SheetTitle>
        </SheetHeader>
        <SheetBody userId={userId} />
      </SheetContent>
    </Sheet>
  );
}

const SheetBody = ({ userId }: { userId?: string }) => {
  const userQuery = useGetUser(userId);

  // if userId is not specified that means that a new user will be created
  if (userId) {
    if (userQuery.isPending || userQuery.isLoading) return <Spinner />;

    if (userQuery.isError) return <div>something went wrong.</div>;

    return <EditUserForm user={userQuery.data} userId={userId} />;
  }
  return <NewUserForm />;
};
