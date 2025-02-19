import { create } from "zustand";

interface CatalogueOrderState {
  order: "asc" | "desc";
  setOrder: (order: "asc" | "desc") => void;
}

const useCatalogueOrderStore = create<CatalogueOrderState>((set) => ({
  order: "desc",
  setOrder: (order) => set({ order }),
}));

export default useCatalogueOrderStore;
