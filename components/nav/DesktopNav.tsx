"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/lib/store/sidebar";

const links = {
  joyce: {
    name: "Joyce Shi",
    href: "https://joyceshidesign.com/",
  },
  us: {
    name: "Online Shop (US)",
    href: "https://gaxis.square.site/s/shop",
  },
  china: {
    name: "Online Shop (China)",
    href: "https://shop123538984.world.taobao.com/?spm=2013.1.1000126.d21.221532eaJ6bWHM",
  },
  email: {
    name: "Contact",
    href: "mailto:joyceshidesign@gmail.com",
  },
};

const DesktopNav = () => {
  const pathname = usePathname();
  const isOpen = useSidebarStore((state) => state.isOpen);
  const setIsOpen = useSidebarStore((state) => state.setIsOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-[150px] p-[30px] grid grid-cols-12 gap-[10px] border-b border-foreground bg-background">
        <div className="flex gap-[8px] col-span-7">
          <div className="text-highlight">G Axis Press is</div>
          <div>
            <p>
              the self-publication practice of NY-based designer{" "}
              <a href={links.joyce.href} className="underline" target="_blank">
                {links.joyce.name}
              </a>
            </p>
            <p>
              <a href={links.us.href} className="underline" target="_blank">
                {links.us.name}
              </a>{" "}
              /{" "}
              <a href={links.china.href} className="underline" target="_blank">
                {links.china.name}
              </a>{" "}
              /{" "}
              <a href={links.email.href} target="_blank">
                {links.email.name}
              </a>
            </p>
          </div>
        </div>
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
      </nav>
      <div className="h-[150px]"></div>
    </>
  );
};

export default DesktopNav;
