"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useSidebarStore } from "@/lib/store/sidebar";
import Events from "./Events";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

// ipad: 2/3,  desktop: 5/12

const EventsSidebar = () => {
  const { isOpen } = useSidebarStore();
  const isFirstRender = useRef(true);

  useGSAP(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isOpen) {
      gsap.to(["body", "nav"], {
        backgroundColor: "#F2F2F2",
        duration: 0,
      });

      gsap.fromTo(
        ".events-sidebar",
        {
          width: "0px",
        },
        {
          width: "41.6vw",
          duration: 0.3,
        }
      );
    } else {
      gsap.to(["body", "nav"], {
        backgroundColor: "var(--background)",
        duration: 0,
      });

      gsap.to(".events-sidebar", {
        width: "0px",
        duration: 0.3,
      });
    }
  }, [isOpen]);

  return (
    <aside className="events-sidebar fixed w-0 h-full top-[150px] right-0 bg-background z-20 border-l border-l-foreground border-b">
      <Events />
    </aside>
  );
};

export default EventsSidebar;
