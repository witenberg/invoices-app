import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`hover:text-[#2E75B6] ${
        isActive ? 'text-[#2E75B6] font-bold' : 'text-gray-700 font-medium'
      }`}
    >
      {children}
    </Link>
  )
}

