import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/dashboard"]
const publicRoutes = ["/login", "/signup", "/", "/features", "/pricing", "/blog"]

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => path === route)

  const isAuthenticated = req.cookies.has("authjs.session-token")

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard/invoices", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",

    // Public routes that should redirect when authenticated
    "/login",
    "/signup",
    "/",
    "/features",
    "/pricing",
    "/blog"
  ],
}

