"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { CreateSubscriptionForm } from "../../create/CreateSubscriptionForm"
import { Subscription } from "@/types/subscription"

export default function EditInvoicePage() {
    const params = useParams()
    const router = useRouter()
    const [subscription, setSubscription] = useState<Subscription | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchSubscription = async () => {

            setIsLoading(true)
            const response = await fetch(`/api/subscriptions/${params.id}`)

            if (response.ok) {
                const data = await response.json()
                setSubscription(data)
            } else {
                console.error("Failed to fetch subscription")
                router.push("/dashboard/subscriptions")
            }
            setIsLoading(false)
        }

        fetchSubscription()
    }, [params.id, router])

    //   if (status === "loading" || isLoading) {
    //     return <div>Loading...</div>
    //   }

    //   if (status === "unauthenticated") {
    //     return <div>Please log in to edit invoices.</div>
    //   }

    if (!subscription) {
        return <div>Loading...</div>
    }

    return (
        <CreateSubscriptionForm initialSub={subscription} />
    )
}

