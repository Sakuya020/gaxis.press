"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/lib/store/sidebar";
import { cn } from "@/lib/utils";

const Router = () => {
  const pathname = usePathname();
  const isOpen = useSidebarStore((state) => state.isOpen);
  const setIsOpen = useSidebarStore((state) => state.setIsOpen);

  return (
    <p className="col-start-8 col-span-5 text-wrap">
      <span>
        <button
          type="button"
          className={cn(
            "cursor-pointer select-none hover:text-highlight",
            isOpen && "active-link"
          )}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          (Past and Upcoming Events)
        </button>
        <span className="px-2">/</span>
      </span>

      <span>
        <Link
          href="/"
          className={cn(
            "hover:text-highlight ",
            pathname === "/" && "active-link"
          )}
        >
          IMG Library
        </Link>
      </span>

      <span>
        <span className="px-2">/</span>
        <Link
          href="/full_catalogue"
          className={cn(
            "hover:text-highlight",
            pathname === "/full_catalogue" && "active-link"
          )}
        >
          Full Catalogue
        </Link>
      </span>
    </p>
  );
};

export default Router;
