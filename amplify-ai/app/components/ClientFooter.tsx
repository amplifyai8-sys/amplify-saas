"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ClientFooter() {
  const pathname = usePathname();
  
  // LOGIC: If we are on ANY dashboard page, do NOT show the footer
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }
  
  return <Footer />;
}