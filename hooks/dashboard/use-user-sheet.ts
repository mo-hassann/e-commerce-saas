import { create } from "zustand";

interface Sheet {
  isOpen: boolean;
  onOpen: (userId?: string) => void;
  onClose: () => void;
  userId?: string;
}

const useUserSheet = create<Sheet>((set) => ({
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: (userId) => set(() => ({ isOpen: true, userId })),
}));

export default useUserSheet;
