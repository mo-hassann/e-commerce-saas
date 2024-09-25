import { create } from "zustand";

interface Sheet {
  isOpen: boolean;
  onOpen: (id?: string) => void;
  onClose: () => void;
  id?: string;
}

const useProductSheet = create<Sheet>((set) => ({
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: (id) => set(() => ({ isOpen: true, id })),
}));

export default useProductSheet;
