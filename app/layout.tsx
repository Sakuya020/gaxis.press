import type { Metadata } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import DesktopNav from "@/components/nav/DesktopNav";
import Sidebar from "@/components/events/Sidebar";
import GlobalClickHandler from "@/components/events/GlobalClickHandler";
import MobileNav from "@/components/nav/MobileNav";
import MobileFooter from "@/components/footer/MobileFooter";

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "G AXIS PRESS",
  description:
    "G Axis Press is the self-publication practice of NY-based designer Joyce Shi",
};

export const revalidate = 600; // revalidate data every 10 minutes

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmMono.variable} ${dmSans.variable} antialiased`}>
        <GlobalClickHandler />
        <DesktopNav />
        <MobileNav />
        {children}
        <Sidebar />
        <MobileFooter />
      </body>
    </html>
  );
}
