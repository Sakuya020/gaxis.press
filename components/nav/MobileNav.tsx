"use client";

import { usePathname } from "next/navigation";
import ReverseOrder from "@/components/events/ReverseOrder";

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
      <nav className="fixed top-0 left-0 right-0 h-[120px] p-[30px] pb-[10px] border-b border-foreground bg-secondaryBackground flex flex-col justify-between z-10 md:hidden">
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
      <div className="h-[120px] md:hidden"></div>
    </>
  );
};

export default DesktopNav;
