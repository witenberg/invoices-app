'use client'

import { SidebarMenuButton } from "../ui/sidebar"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function Logout() {
    return (
        <div>
            <SidebarMenuButton onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="w-5 h-5 mr-3" />
                <span>Log Out</span>
            </SidebarMenuButton>
        </div>
    )
}
