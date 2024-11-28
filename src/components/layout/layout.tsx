import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const navItems = [
  { name: 'Invoices', href: '/invoices' },
  { name: 'Subscriptions', href: '/subscriptions' },
  { name: 'Sales Pages', href: '/salespages' },
  { name: 'Clients', href: '/clients' },
  { name: 'Reports', href: '/reports' },
  { name: 'Settings', href: '/settings/invoices' },
  { name: 'Help', href: '/help' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <Link href="/invoices" className="text-2xl font-bold text-primary">
            InvoiceApp
          </Link>
        </div>
        <nav className="mt-8">
          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`block py-2 px-4 ${
                    router.pathname === item.href
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}

