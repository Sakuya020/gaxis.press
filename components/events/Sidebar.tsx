"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useSidebarStore } from "@/lib/store/sidebar";
import Events from "./Events";
import { useRef } from "react";
import { usePathname } from "next/navigation";

gsap.registerPlugin(useGSAP);

// ipad: 2/3,  desktop: 5/12

const EventsSidebar = () => {
  const { isOpen } = useSidebarStore();
  const isFirstRender = useRef(true);
  const pathname = usePathname();

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isOpen) {
      if (pathname === "/full_catalogue") {
        gsap.to(["body", ".desktop-nav", "footer"], {
          backgroundColor: "var(--secondary-background)",
          duration: 0,
        });
      }

      gsap.fromTo(
        ".events-sidebar",
        {
          width: "0px",
          border: "none",
        },
        {
          width: "41.6vw",
          borderLeft: "1px solid var(--foreground)",
          duration: 0.3,
        }
      );
    } else {
      gsap.to(["body", ".desktop-nav", "footer"], {
        backgroundColor: "var(--background)",
        duration: 0,
      });

      gsap.to(".events-sidebar", {
        width: "0px",
        border: "none",
        duration: 0.3,
      });
    }
  }, [isOpen]);

  return (
    <aside className="events-sidebar fixed w-0 h-full top-[150px] right-0 bg-background z-20 border-b">
      <Events />
    </aside>
  );
};

export default EventsSidebar;
