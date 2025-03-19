import { SessionProvider } from "next-auth/react"
import { InvoiceList } from "./InvoiceList"
import { FilterComponent } from "@/components/dahboard/Filter"
import { subscription_statuses } from "@/constants/statuses"

export default function InvoicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <SessionProvider>
        <FilterComponent statuses={subscription_statuses} kind="invoices" />
        <InvoiceList />
      </SessionProvider>
    </div>
  )
}

