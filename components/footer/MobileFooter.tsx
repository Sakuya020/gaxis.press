import Link from "next/link";

const MobileFooter = () => {
  return (
    <>
      <div className="h-[120px] md:hidden"></div>
      <footer className="fixed h-[120px] bottom-0 left-0 right-0 flex border-t border-foreground bg-white z-30 md:hidden">
        <div className="w-1/3 h-full flex flex-col items-center justify-center border-r border-foreground text-center">
          <div>
            <Link href="/" className="whitespace-nowrap">
              IMG Library
            </Link>
          </div>
          <p>/</p>
          <div>
            <Link href="/full_catalogue" className=" whitespace-nowrap">
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
          <Link href="/events">
            <p>Past</p>
            <p>and Upcoming</p>
            <p>Events</p>
          </Link>
        </div>
      </footer>
    </>
  );
};

export default MobileFooter;
