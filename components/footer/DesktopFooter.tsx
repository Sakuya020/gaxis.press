"use client";

import Router from "../nav/Router";

const DesktopFooter = () => {
  return (
    <>
      <div className="h-[150px]"></div>
      <footer className="fixed h-[150px] bottom-0 left-0 right-0 flex items-end px-[30px] py-[20px] border-t border-foreground bg-white z-30">
        <ul className="grid grid-cols-12 gap-[10px] w-full">
          <li className="col-span-7">(c) 2014-2025</li>
          <Router />
        </ul>
      </footer>
    </>
  );
};

export default DesktopFooter;
