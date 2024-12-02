'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#2E75B6]">
            SimpleInvoices
          </Link>
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`hover:text-[#2E75B6] ${
                isActive('/') ? 'text-[#2E75B6] font-bold' : 'text-gray-700 font-medium'
              }`}
            >
              HOME
            </Link>
            <Link
              href="/features"
              className={`hover:text-[#2E75B6] ${
                isActive('/features') ? 'text-[#2E75B6] font-bold' : 'text-gray-700 font-medium'
              }`}
            >
              FEATURES
            </Link>
            <Link
              href="/pricing"
              className={`hover:text-[#2E75B6] ${
                isActive('/pricing') ? 'text-[#2E75B6] font-bold' : 'text-gray-700 font-medium'
              }`}
            >
              PRICING
            </Link>
            <Link
              href="/blog"
              className={`hover:text-[#2E75B6] ${
                isActive('/blog') ? 'text-[#2E75B6] font-bold' : 'text-gray-700 font-medium'
              }`}
            >
              BLOG
            </Link>
            <Link
              href="/login"
              className={`hover:text-[#2E75B6] ${
                isActive('/login') ? 'text-[#2E75B6] font-bold' : 'text-gray-700 font-medium'
              }`}
            >
              LOG IN
            </Link>
            <Button asChild className="bg-[#2E75B6] hover:bg-[#235d92] text-white font-medium">
              <Link href="/signup">FREE TRIAL</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

