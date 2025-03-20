import { SessionProvider } from "next-auth/react"
import { InvoiceList } from "./InvoiceList"
import { FilterComponent } from "@/components/dahboard/Filter"
import { invoice_statuses } from "@/constants/statuses"
import CreateButton from "@/components/dahboard/CreateButton"

export default function InvoicesPage() {
  return (
    <div className="container mx-auto px-12 py-8">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      <SessionProvider>
        <div className="flex justify-between">
          <FilterComponent statuses={invoice_statuses} kind="invoices" />
          <CreateButton kind="invoices" />
        </div>
        <InvoiceList />
      </SessionProvider>
    </div>
  )
}

