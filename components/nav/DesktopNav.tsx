"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-[150px] p-[30px] grid grid-cols-12 border-b border-foreground">
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
          <li>(Past and Upcoming Events)</li>
          <li>/</li>
          <li>
            <Link href="/" className={cn(pathname === "/" && "active-link")}>
              IMG Library
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href="/full_catalogue"
              className={cn(pathname === "/full_catalogue" && "active-link")}
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
