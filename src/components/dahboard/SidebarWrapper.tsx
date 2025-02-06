"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "./Sidebar";

export default function SidebarWrapper() {
  const pathname = usePathname();
  return <AppSidebar pathname={pathname} />;
}
