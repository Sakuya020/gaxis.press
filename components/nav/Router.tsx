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
    <ul className="flex col-start-8 col-span-4 gap-[8px]">
      <li>
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
      </li>
      <li>/</li>
      <li>
        <Link
          href="/"
          className={cn(
            "hover:text-highlight",
            pathname === "/" && "active-link"
          )}
        >
          IMG Library
        </Link>
      </li>
      <li>/</li>
      <li>
        <Link
          href="/full_catalogue"
          className={cn(
            "hover:text-highlight",
            pathname === "/full_catalogue" && "active-link"
          )}
        >
          Full Catalogue
        </Link>
      </li>
    </ul>
  );
};

export default Router;
