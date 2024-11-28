import React from 'react'
import { Navbar } from '@/components/navbar'
import '@/app/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gray-100 py-6">
            <div className="container mx-auto px-6 text-center text-gray-600">
              © 2023 SimpleInvoices. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

