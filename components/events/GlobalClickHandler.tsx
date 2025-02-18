"use client";

import { useEffect } from "react";
import { useSidebarStore } from "@/lib/store/sidebar";

const GlobalClickHandler = () => {
  const setIsOpen = useSidebarStore((state) => state.setIsOpen);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // 检查点击是否在侧边栏或导航按钮之外
      const isSidebar = target.closest(".events-sidebar");
      const isNavButton = target.closest("button");

      if (!isSidebar && !isNavButton) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [setIsOpen]);

  return null;
};

export default GlobalClickHandler;
