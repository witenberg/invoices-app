"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CreateInvoiceForm } from "../../create/CreateInvoiceForm"
import type { InvoiceToEdit } from "@/types/invoice"
import { SessionProvider } from "next-auth/react"

export default function EditInvoicePage() {
    const params = useParams()
    const router = useRouter()
    const [invoice, setInvoice] = useState<InvoiceToEdit | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchInvoice = async () => {

            setIsLoading(true)
            const response = await fetch(`/api/invoices/${params.id}`)

            if (response.ok) {
                const data = await response.json()
                setInvoice(data)
            } else {
                console.error("Failed to fetch invoice")
                router.push("/dashboard/invoices")
            }
            setIsLoading(false)
        }

        fetchInvoice()
    }, [params.id, router])

    //   if (status === "loading" || isLoading) {
    //     return <div>Loading...</div>
    //   }

    //   if (status === "unauthenticated") {
    //     return <div>Please log in to edit invoices.</div>
    //   }

    if (!invoice) {
        return <div>Loading...</div>
    }

    return (
        <SessionProvider>
            <CreateInvoiceForm initialInvoice={invoice} />
        </SessionProvider>
    )
}

