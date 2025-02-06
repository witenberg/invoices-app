import { SessionProvider } from "next-auth/react"
import { ClientFilter } from "./InvoiceFilter"
import { InvoiceList } from "./InvoiceList"

export default function InvoicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <SessionProvider>
        <ClientFilter />
        <InvoiceList />
      </SessionProvider>
    </div>
  )
}

