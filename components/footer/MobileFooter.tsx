"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "US",
    href: "https://gaxis.square.site/s/shop",
  },
  {
    name: "CN",
    href: "https://shop123538984.world.taobao.com/?spm=2013.1.1000126.d21.221532eaJ6bWHM",
  },
];

const MobileFooter = () => {
  const pathname = usePathname();
  return (
    <>
      <div className="h-[130px] md:hidden" />

      <div className="fixed bottom-0 left-0 right-0 md:hidden">
        <ul className="flex justify-center gap-6 mb-6">
          {links.map((link) => (
            <li
              key={link.href}
              className="flex justify-center items-center rounded-full w-[35px] h-[35px] border border-foreground bg-background"
            >
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <footer className="h-[130px] flex border-t border-foreground bg-background">
          <div className="w-1/3 h-full flex flex-col items-center justify-center border-r border-foreground text-center">
            <div>
              <Link href="/" className={cn(pathname == "/" && "active-link")}>
                IMG Library
              </Link>
            </div>
            <p>/</p>
            <div>
              <Link
                href="/full_catalogue"
                className={cn(pathname == "/full_catalogue" && "active-link")}
              >
                Full Catalogue
              </Link>
            </div>
          </div>
          <div className="w-1/3 h-full flex items-center justify-center border-r border-foreground">
            <a href="mailto:joyceshidesign@gmail.com" target="_blank">
              Contact
            </a>
          </div>
          <div className="w-1/3 h-full flex items-center justify-center text-center">
            <Link
              href="/events"
              className={cn(pathname == "/events" && "active-link")}
            >
              <p>Past</p>
              <p>and Upcoming</p>
              <p>Events</p>
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MobileFooter;
