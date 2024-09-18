import { create } from "zustand";

interface Sheet {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCartSheet = create<Sheet>((set) => ({
  isOpen: false,
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: () => set(() => ({ isOpen: true })),
}));

export default useCartSheet;
