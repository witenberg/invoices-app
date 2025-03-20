'use client'

import { InvoiceList } from "@/app/dashboard/invoices/InvoiceList";
import { FilterComponent } from "@/components/dahboard/Filter";
import { invoice_statuses } from "@/constants/statuses";
import { SessionProvider } from "next-auth/react";

export default function InvoicesSummary({ id } : {id: string}) {
    const additionalPath = `/${id}/details`
    return (
        <div className="p-6">
            <SessionProvider>
                <FilterComponent statuses={invoice_statuses} kind="subscriptions" additionalPath={additionalPath} />
                <InvoiceList subId={id}/>
            </SessionProvider>
        </div>
    )
}