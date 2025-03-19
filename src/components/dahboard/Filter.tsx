"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterComponentProps {
  statuses: string[]
  kind: string
  basePath?: string
  createLabel?: string
}

export function FilterComponent({ 
  statuses, 
  kind, 
  basePath = "/dashboard", 
  createLabel = "New" 
}: FilterComponentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentStatus = searchParams.get("status") || "All"
  
  statuses = ["All", ...statuses]

  const handleStatusChange = (status: string) => {
    router.push(
      `${basePath}/${kind}${status === "All" ? "" : `?status=${status}`}`
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
      <Button 
        onClick={() => router.push(`${basePath}/${kind}/create`)} 
        className="bg-blue-600 hover:bg-blue"
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        {createLabel} {kind.charAt(0).toUpperCase() + kind.slice(1, -1)}
      </Button>
    </div>
  )
}