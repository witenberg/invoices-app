'use client'

import { CreateInvoiceForm } from "./CreateInvoiceForm"
import { SessionProvider } from "next-auth/react"

export default function CreateInvoicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">New Invoice</h1>
      <SessionProvider>
        <CreateInvoiceForm />
      </SessionProvider>
    </div>
  )
}

