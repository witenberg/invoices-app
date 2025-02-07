"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const statuses = ["All", "Draft", "Sent", "Paid", "Refunded", "Deleted"]

export function ClientFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get("status") || "All"

  const handleStatusChange = (status: string) => {
    router.push(`/dashboard/invoices${status === "All" ? "" : `?status=${status}`}`)
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-4 py-2 rounded ${currentStatus === status ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {status}
          </button>
        ))}
      </div>
      <Button onClick={() => router.push("/dashboard/invoices/create")} className="bg-blue-600 hover:bg-blue-700">
        <PlusCircle className="w-4 h-4 mr-2" />
        New Invoice
      </Button>
    </div>
  )
}

