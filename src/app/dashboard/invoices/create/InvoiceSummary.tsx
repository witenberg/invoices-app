"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { InvoiceItem } from "@/types/invoiceItem"

interface InvoiceSummaryProps {
    userId: string
    clientName: string
    items: InvoiceItem[]
    onSave: (isDraft: boolean) => Promise<void>
    error: string | null
}

export function InvoiceSummary({ userId, clientName, items, onSave, error }: InvoiceSummaryProps) {
    const [isSaving, setIsSaving] = useState(false)

    const calculateTotal = () => {
        return items.reduce((sum, item) => {
            const quantity = item.quantity || 1
            return sum + item.amount * quantity
        }, 0)
    }

    const handleSave = async (isDraft: boolean) => {
        setIsSaving(true)
        try {
            await onSave(isDraft)
            // router.push("/dashboard/invoices")
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
                <div className="text-2xl font-bold">USD {calculateTotal().toFixed(2)}</div>
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

                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleSave(false)} disabled={isSaving}>
                    {isSaving ? "Sending..." : "Send Invoice"}
                </Button>

                <button
                    className="w-full text-center text-blue-600 hover:text-blue-800"
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                >
                    Save as Draft
                </button>
            </div>
        </div>
    )
}

