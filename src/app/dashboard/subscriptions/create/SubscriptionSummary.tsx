"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { InvoiceItem } from "@/types/invoiceItem"
import { useRouter } from "next/navigation"
import { SubscriptionFrequency } from "@/types/subscription"

interface SubscriptionSummaryProps {
    userId: string
    clientName: string
    items: InvoiceItem[]
    onSave: (isDraft: boolean) => Promise<void>
    error: string | null
    currency: string
    invoiceId: number | null
    frequency: SubscriptionFrequency
}

export function SubscriptionSummary({ userId, clientName, items, onSave, error, currency, invoiceId, frequency }: SubscriptionSummaryProps) {
    const [isSaving, setIsSaving] = useState(false)
    const router = useRouter()

    const calculateTotal = () => {
        return items.reduce((sum, item) => {
            const quantity = item.quantity || 1
            return sum + (item.amount || 0) * quantity
        }, 0)
    }

    const handleSave = async (isDraft: boolean) => {
        setIsSaving(true)
        try {
            await onSave(isDraft)
        } catch (error) {
            console.error("Error saving invoice:", error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg fixed right-8 top-8 w-80">
            <div className="text-center mb-6">
                <div className="text-sm text-gray-500">NEW</div>
                <div className="text-2xl font-bold">{currency} {calculateTotal().toFixed(2)}</div>
                <div className="text-sm text-gray-600">{frequency}</div>
                <div className="text-sm text-gray-600">{clientName || "No client selected"}</div>
            </div>

            <div className="space-y-6">
                {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium">Pay Automatically</div>
                        <div className="text-xs text-gray-500">You haven't turned on credit card payments.</div>
                    </div>
                </div>

                {!invoiceId &&
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleSave(false)} disabled={isSaving}>
                        {isSaving ? "Activating..." : "Activate"}
                    </Button>
                }

                {!invoiceId &&
                    <Button
                        className="w-full bg-white-600 text-blue-600 border hover:border-black hover:bg-white"
                        onClick={() => handleSave(true)}
                        disabled={isSaving}
                    >
                        Save as Draft
                    </Button>
                }

                {invoiceId &&
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleSave(false)} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save changes"}
                    </Button>
                }

                {invoiceId &&
                    <Button
                        className="w-full bg-white-600 text-blue-600 border hover:border-black hover:bg-white"
                        onClick={() => router.push(`/dashboard/subscriptions`)}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                }
            </div>
        </div>
    )
}

