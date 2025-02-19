"use client";

import { usePathname } from "next/navigation";
import ReverseOrder from "@/components/events/ReverseOrder";
import { cn } from "@/lib/utils";

const links = {
  joyce: {
    name: "Joyce Shi",
    href: "https://joyceshidesign.com/",
  },
};

const DesktopNav = () => {
  const pathname = usePathname();

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 h-[125px] p-[30px] pb-[10px] border-b border-foreground flex flex-col justify-between z-10 md:hidden",
          pathname === "/" && "text-background border-0"
        )}
      >
        {/* intro */}

        <p>
          <span className="md:hidden text-highlight">G Axis Press is </span>
          the self-publication practice of NY-based designer{" "}
          <a href={links.joyce.href} className="underline" target="_blank">
            {links.joyce.name}
          </a>
        </p>

        {pathname == "/full_catalogue" && <ReverseOrder />}
      </nav>
      {pathname !== "/" && <div className="h-[125px] md:hidden"></div>}
    </>
  );
};

export default DesktopNav;
