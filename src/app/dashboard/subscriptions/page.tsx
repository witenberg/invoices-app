import { FilterComponent } from "@/components/dahboard/Filter"
import { SessionProvider } from "next-auth/react"
import { SubscriptionList } from "./SubscriptionList"

export default function Subscriptions() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
            <SessionProvider>
                <FilterComponent statuses={['All', 'Active', 'Paused', 'Deleted']} kind="Subscriptions" />
                <SubscriptionList/>
            </SessionProvider>
        </div>
    )

}