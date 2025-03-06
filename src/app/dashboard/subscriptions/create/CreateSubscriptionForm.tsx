"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { ClientSection } from "@/components/dahboard/create/ClientSection"
import { ItemsSection } from "@/components/dahboard/create/ItemsSection"
import { OptionsSection } from "@/components/dahboard/create/OptionsSection"
import { SubscriptionSummary } from "./SubscriptionSummary"
import type { InvoiceOptions, InvoiceSubscription, } from "@/types/invoice"
import type { InvoiceItem } from "@/types/invoiceItem"
import { useRouter } from "next/navigation"
import { ScheduleSection } from "./ScheduleSection"
import { Subscription, SubscriptionFrequency } from "@/types/subscription"

interface FormData {
  clientName: string
  clientEmail: string
  clientAddress: string
}

interface ScheduleData {
  startDate: Date
  frequency: SubscriptionFrequency
  endDate: Date | undefined
}

interface CreateSubFormProps {
  initialSub?: Subscription
}

export function CreateSubscriptionForm({ initialSub }: CreateSubFormProps) {
  // console.log(!!initialSub?.invoiceid)
  const { data: session } = useSession()
  const subId = initialSub?.subscriptionid
  const userId = (session?.user as any)?.userid
  const [selectedClientId, setSelectedClientId] = useState<number | null>(initialSub?.invoicePrototype.clientid || null)
  const [formData, setFormData] = useState<FormData>({
    clientName: initialSub?.invoicePrototype.client.name || "",
    clientEmail: initialSub?.invoicePrototype.client.email || "",
    clientAddress: initialSub?.invoicePrototype.client.address || "",
  })
  // console.log(initialSub?.products)
  const [items, setItems] = useState<InvoiceItem[]>(
    initialSub?.invoicePrototype.products || [{ id: "1", description: "", amount: null }])
  const [options, setOptions] = useState<InvoiceOptions>({
    currency: initialSub?.invoicePrototype.currency || "USD",
    language: initialSub?.invoicePrototype.language || "English",
    // date: initialSub?.invoicePrototype.date || new Date().toISOString().split("T")[0],
    acceptcreditcards: initialSub?.invoicePrototype.acceptcreditcards || false,
    acceptpaypal: initialSub?.invoicePrototype.acceptpaypal || false,
  })
  const [schedule, setSchedule] = useState<ScheduleData>({
    startDate: initialSub?.start_date
      ? new Date(initialSub.start_date)
      : new Date(),
    frequency: initialSub?.frequency || "Monthly",
    endDate: initialSub?.end_date
      ? new Date(initialSub.end_date)
      : undefined,
  });
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
      if (!selectedClientId && (!formData.clientName || !formData.clientEmail)) {
        setError("Client name and email are required")
        return
      }
      if (!validateItems(items)) {
        setError("Fix items")
        return
      }

      const clientId = selectedClientId || (await createNewClient())

      const sub: Subscription = {
        subscriptionid: subId || undefined,
        start_date: schedule.startDate.toISOString().split("T")[0],
        frequency: schedule.frequency,
        end_date: schedule.endDate?.toISOString().split("T")[0] || undefined,
        status: isDraft ? "Paused" : "Active",
        invoicePrototype: {
          userid: userId,
          clientid: clientId,
          currency: options.currency,
          language: options.language,
          acceptcreditcards: options.acceptcreditcards,
          acceptpaypal: options.acceptpaypal,
          client: {
            name: formData.clientName,
            email: formData.clientEmail,
            address: formData.clientAddress,
          },
          products: items
        }
      }

      const response = await fetch("/api/subscriptions/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sub),
      })

      if (!response.ok) {
        throw new Error("Failed to save subscription")
      }
      const data = await response.json()
      router.push(`/dashboard/subscriptions/${data.subscriptionid}/details`)
    } catch (error) {
      console.error("Error saving subscription:", error)
      setError("Failed to save subscription")
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
        <ScheduleSection initialSchedule={schedule} onScheduleChange={(newSchedule) => { setSchedule(newSchedule) }} />
        <OptionsSection userId={userId} options={options} onOptionsChange={setOptions} />
      </div>

      <SubscriptionSummary userId={userId} clientName={formData.clientName} items={items} onSave={handleSave} error={error} currency={options.currency} subId={initialSub?.subscriptionid || null} frequency={schedule.frequency} />
    </div>
  )
}

