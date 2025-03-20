import { FilterComponent } from "@/components/dahboard/Filter"
import { SessionProvider } from "next-auth/react"
import { SubscriptionList } from "./SubscriptionList"
import { subscription_statuses } from "@/constants/statuses"
import CreateButton from "@/components/dahboard/CreateButton"

export default function Subscriptions() {
    return (
        <div className="container mx-auto px-12 py-8">
            <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
            <SessionProvider>
                <div className="flex justify-between">
                    <FilterComponent statuses={subscription_statuses} kind="subscriptions" />
                    <CreateButton kind="subscriptions" />
                </div>
                <SubscriptionList/>
            </SessionProvider>
        </div>
    )

}