import Link from "next/link"
import { FileText, Repeat, Layout, Users, BarChart3, Settings, HelpCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Logout } from "./Logout"


const navigation = [
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
  { name: "Subscriptions", href: "/dashboard/subscriptions", icon: Repeat },
  { name: "Sales Pages", href: "/sales-pages", icon: Layout },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
]

export function AppSidebar({ pathname }: { pathname: string }) {

  return (
    <Sidebar className="bg-[#0a2547] text-white">
      <SidebarHeader>
        <Link href="/dashboard/invoices" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">simple.</span>
          <span className="text-sm">INVOICES</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton isActive={pathname.startsWith(item.href)}>
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <Logout /> 
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

