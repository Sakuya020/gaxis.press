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
          "w-full h-[125px] p-[30px] pb-[10px] border-b border-foreground flex flex-col justify-between md:hidden z-10 fade-in-down",
          pathname === "/"
            ? "text-background border-0 fixed top-0 left-0 right-0"
            : "bg-secondaryBackground"
        )}
      >
        {/* intro */}

        <p>
          <span className="md:hidden text-highlight">G Axis Press </span>
          is the self-publication practice of NY-based designer{" "}
          <a href={links.joyce.href} className="underline" target="_blank">
            {links.joyce.name}
          </a>
          .
        </p>

        {pathname == "/full_catalogue" && <ReverseOrder />}
      </nav>
    </>
  );
};

export default DesktopNav;
