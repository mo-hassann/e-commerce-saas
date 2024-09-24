import { create } from "zustand";

interface Sheet {
  isOpen: boolean;
  onOpen: (name?: string, id?: string) => void;
  onClose: () => void;
  id?: string;
  name: string;
}

const useBrandSheet = create<Sheet>((set) => ({
  isOpen: false,
  name: "",
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: (name, id) => set(() => ({ isOpen: true, id, name })),
}));

export default useBrandSheet;
