"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface FilterComponentProps {
  statuses: string[]
  kind: "invoices" | "subscriptions"
  basePath?: string
  createLabel?: string
  additionalPath?: string
}

export function FilterComponent({ 
  statuses, 
  kind, 
  basePath = "/dashboard",
  additionalPath
}: FilterComponentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get("status") || "All"
  
  statuses = ["All", ...statuses]

  const handleStatusChange = (status: string) => {
    router.push(
      `${basePath}/${kind}${additionalPath ? additionalPath : ""}${status === "All" ? "" : `?status=${status}`}`
    )
  }


  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-2">
        {statuses.map((status) => (
          <Button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-4 py-2 rounded ${
              currentStatus === status 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-black"
            }`}
          >
            {status}
          </Button>
        ))}
      </div>
    </div>
  )
}