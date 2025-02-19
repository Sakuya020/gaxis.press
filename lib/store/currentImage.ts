import { create } from "zustand";
import { ImageType } from "@/lib/types";

interface CurrentImageStore {
  images: ImageType[];
  currentImage: ImageType | null;
  setCurrentImage: (image: ImageType | null) => void;
}

export const useCurrentImageStore = create<CurrentImageStore>()((set) => ({
  images: [],
  currentImage: null,
  setCurrentImage: (image) => set({ currentImage: image }),
}));
