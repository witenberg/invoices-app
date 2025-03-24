import type * as React from "react"
import { SessionProvider } from "next-auth/react"
import SidebarWrapper from "@/components/dahboard/SidebarWrapper"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
        <SidebarWrapper />
        <main className="flex-1">{children}</main>
      </SessionProvider>
    </div>
  )
}

