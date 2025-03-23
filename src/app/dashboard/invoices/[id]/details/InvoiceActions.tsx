"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function InvoiceActions({ invoiceId }: { invoiceId: string }) {
    const router = useRouter()
    const currentUrl = `${window.location.origin}/dashboard/invoices/${invoiceId}/details`

    const handleEdit = () => {
        router.push(`/dashboard/invoices/${invoiceId}/edit`)
    }

    const handlePay = () => {
        // Payment logic to be implemented
    }

    const handleSend = () => {
        // Send logic to be implemented
    }

    const handleView = () => {
        window.open(`/invoices/${invoiceId}`, '_blank')
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl)
            // alert()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = () => {
        // Delete logic to be implemented
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleEdit}>
                Edit
            </Button>
            <Button className="w-full bg-white-600 text-blue-600 border hover:border-black hover:bg-white" onClick={handlePay}>
                Pay
            </Button>
            <Button className="w-full bg-white-600 text-blue-600 border hover:border-black hover:bg-white" onClick={handleSend}>
                Send
            </Button>
            <Button className="w-full bg-white-600 text-blue-600 border hover:border-black hover:bg-white" onClick={handleView}>
                View
            </Button>
            <Button className="w-full bg-white-600 text-blue-600 border hover:border-black hover:bg-white" onClick={handleCopyLink}>
                Copy Link
            </Button>
            <Button className="w-full bg-white-600 text-red-600 border hover:border-black hover:bg-white" onClick={handleDelete}>
                Delete
            </Button>
        </div>
    )
}

