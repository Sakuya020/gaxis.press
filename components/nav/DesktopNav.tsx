"use client";

import { usePathname } from "next/navigation";
import ImageTitle from "@/components/img_library/ImageTitle";
import ReverseOrder from "@/components/events/ReverseOrder";
import Router from "./Router";

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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-[150px] p-[30px] pb-[20px] border-b border-foreground bg-background flex-col justify-between z-10 hidden md:flex desktop-nav">
        <div className="grid grid-cols-12 gap-[10px] w-full">
          {/* intro */}
          <div className="flex gap-[8px] col-span-7">
            <span className="hidden lg:block text-highlight">
              G Axis Press is
            </span>
            <div>
              <p>
                <span className="lg:hidden text-highlight">
                  G Axis Press is{" "}
                </span>
                the self-publication practice of NY-based designer{" "}
                <a
                  href={links.joyce.href}
                  className="underline"
                  target="_blank"
                >
                  {links.joyce.name}
                </a>
              </p>
              <p>
                <a href={links.us.href} className="underline" target="_blank">
                  {links.us.name}
                </a>{" "}
                /{" "}
                <a
                  href={links.china.href}
                  className="underline"
                  target="_blank"
                >
                  {links.china.name}
                </a>{" "}
                /{" "}
                <a href={links.email.href} target="_blank">
                  {links.email.name}
                </a>
              </p>
            </div>
          </div>
          {/* routers */}
          <Router />
        </div>
        {pathname == "/" && <ImageTitle />}
        {pathname == "/full_catalogue" && <ReverseOrder />}
      </nav>
      <div className="hidden md:block h-[150px]"></div>
    </>
  );
};

export default DesktopNav;
