import { NextResponse } from "next/server"

export async function middleware(req: Request) {
  const cookieHeader = req.headers.get("cookie")

  if (!cookieHeader || !cookieHeader.includes("authjs.session-token")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
