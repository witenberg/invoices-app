"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { ClientSection } from "./ClientSection"
import { ItemsSection } from "./ItemsSection"
import { OptionsSection } from "./OptionsSection"
import { InvoiceSummary } from "./InvoiceSummary"
import type { Invoice, InvoiceOptions, InvoiceToEdit } from "@/types/invoice"
import type { InvoiceItem } from "@/types/invoiceItem"
import { useRouter } from "next/navigation"

interface FormData {
  clientName: string
  clientEmail: string
  clientAddress: string
}
interface CreateInvoiceFormProps {
  initialInvoice?: InvoiceToEdit
}

export function CreateInvoiceForm({ initialInvoice }: CreateInvoiceFormProps) {
  // console.log(!!initialInvoice?.invoiceid)
  const { data: session } = useSession()
  const invoiceId = initialInvoice?.invoiceid
  const userId = (session?.user as any)?.userid
  const [selectedClientId, setSelectedClientId] = useState<number | null>(initialInvoice?.clientid || null)
  const [formData, setFormData] = useState<FormData>({
    clientName: initialInvoice?.client.name || "",
    clientEmail: initialInvoice?.client.email || "",
    clientAddress: initialInvoice?.client.address || "",
  })
  // console.log(initialInvoice?.products)
  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.products || [{ id: "1", description: "", amount: null }])
  const [options, setOptions] = useState<InvoiceOptions>({
    currency: initialInvoice?.currency || "USD",
    language: initialInvoice?.language || "English",
    date: initialInvoice?.date || new Date().toISOString().split("T")[0],
    acceptcreditcards: initialInvoice?.acceptcreditcards || false,
    acceptpaypal: initialInvoice?.acceptpaypal || false,
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const createNewClient = async (): Promise<number> => {
    if (!formData.clientName || !formData.clientEmail) {
      throw new Error("Client name and email are required")
    }

    const response = await fetch("/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        name: formData.clientName,
        email: formData.clientEmail,
        address: formData.clientAddress,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create client")
    }

    const data = await response.json()
    return data.clientid
  }

  const validateItems = (items: InvoiceItem[]): boolean => {
    if (items.length === 0) return false;
  
    let hasValidItem = false;
  
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
  
      if ((item.description && item.amount === null) || (!item.description && item.amount !== null)) 
        return false;

      if (!item.description && item.amount === null) {
        if (items.length === 1) return false;
        items.splice(i, 1);
      } else {
        hasValidItem = true;
      }
    }
  
    return hasValidItem;
  };
  

  const handleSave = async (isDraft: boolean) => {
    if (!userId) return

    try {
      setError(null)
      console.log (formData.clientName, formData.clientEmail)
      if (!selectedClientId && (!formData.clientName || !formData.clientEmail)) {
        setError("Client name and email are required")
        return
      }
      if (!validateItems(items)) {
        setError("Fix items")
        return
      }

      const clientId = selectedClientId || (await createNewClient())

      const invoice = {
        invoiceid: invoiceId || null,
        userid: userId,
        clientid: clientId,
        status: isDraft ? "Draft" : "Sent",
        options,
        items,
      }

      const response = await fetch("/api/invoices/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      })

      if (!response.ok) {
        throw new Error("Failed to save invoice")
      }
      const data = await response.json()
      router.push(`/dashboard/invoices/${data.invoiceid}/details`)
    } catch (error) {
      console.error("Error saving invoice:", error)
      setError("Failed to save invoice")
    }
  }

  if (!userId) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid grid-cols-3 gap-8 mb-20">
      <div className="col-span-2 space-y-8">
        <ClientSection
          userId={userId}
          formData={formData}
          onFormDataChange={setFormData}
          onClientSelect={(id: number | null) => setSelectedClientId(id)}
        />
        <ItemsSection userId={userId} items={items} onItemsChange={setItems} currency={options.currency} />
        <OptionsSection userId={userId} options={options} onOptionsChange={setOptions} />
      </div>

      <InvoiceSummary userId={userId} clientName={formData.clientName} items={items} onSave={handleSave} error={error} currency={options.currency} invoiceId={initialInvoice?.invoiceid || null} />
    </div>
  )
}

