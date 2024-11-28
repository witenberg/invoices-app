import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <nav className="bg-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#2E75B6]">
            SimpleInvoices
          </Link>
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#2E75B6] font-medium">
              HOME
            </Link>
            <Link href="/features" className="text-gray-700 hover:text-[#2E75B6] font-medium">
              FEATURES
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-[#2E75B6] font-medium">
              PRICING
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-[#2E75B6] font-medium">
              BLOG
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-[#2E75B6] font-medium">
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

