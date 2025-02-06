import type React from "react"
import { cn } from "@/lib/utils"

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("w-64 h-screen flex flex-col", className)}>{children}</div>
}

export function SidebarHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)}>{children}</div>
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-auto", className)}>{children}</div>
}

export function SidebarMenu({ className, children }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("space-y-2", className)}>{children}</ul>
}

export function SidebarMenuItem({ className, children }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)}>{children}</li>
}

export function SidebarMenuButton({
  className,
  children,
  isActive,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }) {
  return (
    <button
      className={cn(
        "flex items-center w-full px-4 py-2 text-left transition-colors",
        isActive ? "bg-blue-700 text-white" : "hover:bg-blue-600 hover:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function SidebarRail() {
  return null
}

