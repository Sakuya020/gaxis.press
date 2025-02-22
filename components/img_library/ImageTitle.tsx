"use client";

import { useCurrentImageStore } from "@/lib/store/currentImage";

const ImageTitle = () => {
  const { currentImage } = useCurrentImageStore();
  return (
    <div className="flex items-center gap-[1rem] w-full">
      <p className="w-fit font-sans text-start rotate-90">↑</p>
      <p className="line-clamp-1">{currentImage?.title}</p>
    </div>
  );
};

export default ImageTitle;
