"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useSidebarStore } from "@/lib/store/sidebar";
import Events from "./Events";
import { useRef } from "react";
import { usePathname } from "next/navigation";

gsap.registerPlugin(useGSAP);

// 768-1024: 2/3,  >1024: 5/12
const EventsSidebar = () => {
  const { isOpen } = useSidebarStore();
  const isFirstRender = useRef(true);
  const pathname = usePathname();

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const mediaQueryLarge = window.matchMedia("(min-width: 1024px)");
    const mediaQueryMedium = window.matchMedia("(min-width: 768px)");

    const updateSidebarWidth = () => {
      if (isOpen) {
        if (pathname === "/full_catalogue") {
          gsap.to(["body", ".desktop-nav", ".desktop-footer"], {
            backgroundColor: "var(--secondary-background)",
            duration: 0,
          });
        }

        // 当sidebar打开时，禁用背景滚动
        document.body.style.overflow = "hidden";

        gsap.fromTo(
          ".events-sidebar",
          {
            width: "0px",
            border: "none",
          },
          {
            width: mediaQueryLarge.matches
              ? "43.6vw"
              : mediaQueryMedium.matches
                ? "71.6vw"
                : "0vw",
            borderLeft: mediaQueryMedium.matches
              ? "1px solid var(--foreground)"
              : "none",
            duration: 0.3,
          }
        );
      } else {
        gsap.to(["body", ".desktop-nav", ".desktop-footer"], {
          backgroundColor: mediaQueryMedium.matches
            ? "var(--background)"
            : "var(--secondary-background)",
          duration: 0,
        });

        // 当sidebar关闭时，恢复背景滚动
        document.body.style.overflow = "auto";

        gsap.to(".events-sidebar", {
          width: "0px",
          border: "none",
          duration: 0.3,
        });
      }
    };

    updateSidebarWidth();

    mediaQueryLarge.addEventListener("change", updateSidebarWidth);
    mediaQueryMedium.addEventListener("change", updateSidebarWidth);

    return () => {
      mediaQueryLarge.removeEventListener("change", updateSidebarWidth);
      mediaQueryMedium.removeEventListener("change", updateSidebarWidth);
    };
  }, [isOpen]);

  return (
    <aside className="events-sidebar fixed w-0 h-full top-[150px] right-0 bg-background z-20 border-b overflow-y-auto">
      <Events />
    </aside>
  );
};

export default EventsSidebar;
