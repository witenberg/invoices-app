"use client"

import { useRouter } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CreateButtonProps {
    kind: "invoices" | "subscriptions"
    basePath?: string
    createLabel?: string
  }

export default function CreateButton({
    kind, 
    basePath = "/dashboard", 
    createLabel = "New" 
  }: CreateButtonProps) {
    const router = useRouter()
    return (
        <Button 
        onClick={() => router.push(`${basePath}/${kind}/create`)} 
        className="bg-blue-600 hover:bg-blue-400"
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        {createLabel} {kind.charAt(0).toUpperCase() + kind.slice(1, -1)}
      </Button>
    )
}