"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ConfirmationModal } from "@/components/ConfirmationModal"

export function InvoiceActions({ invoiceId, subId, status }: { invoiceId: string, subId: string, status: string }) {
    const router = useRouter()
    const currentUrl = `${window.location.origin}/dashboard/invoices/${invoiceId}/details`
    const handleEdit = () => {
        router.push(`/dashboard/invoices/${invoiceId}/edit`)
    }

    const handlePay = () => {
        // Payment logic to be implemented
    }

    const handleSend = async () => {
        try {
            const response = await fetch(`/api/invoices/${invoiceId}/send`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
        
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to send invoice');
            }
        
            router.refresh()
        
          } catch (error) {
            console.error("Error sending invoice:", error);
          }
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

    const handleSubscription = () => {
        router.push(`/dashboard/subscriptions/${subId}/details`)
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
            <ConfirmationModal
                message="Are you sure you want to send this invoice?"
                confirmText={status === "Draft" ? "Send" : "Send Reminder"}
                onConfirm={handleSend}
                triggerText={status === "Draft" ? "Send" : "Send Reminder"}
                triggerClassName="w-full h-10 px-4 py-2 inline-flex items-center justify-center bg-white-600 text-blue-600 border hover:border-black hover:bg-white rounded-md text-sm font-medium"
            />
            <Button className="w-full bg-white-600 text-blue-600 border hover:border-black hover:bg-white" onClick={handleView}>
                View
            </Button>
            <Button className="w-full bg-white-600 text-blue-600 border hover:border-black hover:bg-white" onClick={handleCopyLink}>
                Copy Link
            </Button>
            {subId &&
                <Button className="w-full bg-white-600 text-blue-600 border hover:border-black hover:bg-white" onClick={handleSubscription}>
                    Subscription
                </Button>
            }
            <Button className="w-full bg-white-600 text-red-600 border hover:border-black hover:bg-white" onClick={handleDelete}>
                Delete
            </Button>
        </div>
    )
}

