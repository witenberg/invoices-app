"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { ExtendedUser } from "@/app/actions/user"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SubscriptionToDisplay } from "@/types/subscription"

export function SubscriptionList() {
    const [subscriptions, setSubscriptions] = useState<SubscriptionToDisplay[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { data: session, status } = useSession()
    const searchParams = useSearchParams()
    const statusFilter = searchParams.get("status")
    const router = useRouter()

    useEffect(() => {
        const fetchSubscriptions = async () => {
            if (status !== "authenticated" || !(session?.user as ExtendedUser)?.userid) return

            setIsLoading(true)
            const response = await fetch(
                `/api/subscriptions?${new URLSearchParams({
                    userId: (session.user as ExtendedUser).userid,
                    status: statusFilter || "",
                })}`,
            )

            if (response.ok) {
                const data = await response.json()
                setSubscriptions(data)
            } else {
                console.error("Failed to fetch subscriptions")
            }
            setIsLoading(false)
        }

        fetchSubscriptions()
    }, [(session?.user as ExtendedUser)?.userid, statusFilter, status])

    if (status === "loading") {
        return <div>Loading session...</div>
    }

    if (status === "unauthenticated") {
        return <div>Please log in to view your subscriptions.</div>
    }

    if (isLoading) {
        return <div>Loading subscriptions...</div>
    }

    if (subscriptions.length === 0) {
        return <p>No subscriptions found.</p>
    }

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((sub) => (
                    <tr
                        key={sub.subscriptionid}
                        onClick={() => router.push(`/dashboard/subscriptions/${sub.subscriptionid}/details`)}
                        className="cursor-pointer hover:bg-gray-100"
                    >
                        <td className="px-6 py-4 whitespace-nowrap">{sub.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{sub.currency}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{sub.total}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{sub.client_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{sub.next_invoice ? new Date(sub.next_invoice).toLocaleDateString() : "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{sub.frequency}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                                href={`/dashboard/subscriptions/${sub.subscriptionid}/edit`}
                                className="text-green-600 hover:text-green-900 mr-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Edit
                            </Link>
                            <Link
                                href={`/dashboard/invoices?userId=${(session?.user as ExtendedUser)?.userid}&status=&subId=${sub.subscriptionid}`}
                                className="text-gray-600 hover:text-gray-900"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Invoices
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

