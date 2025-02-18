import { create } from "zustand";

interface SidebarStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()((set) => ({
  isOpen: false,
  setIsOpen: (open) => {
    set((state) => ({
      isOpen: open,
    }));
  },
}));
