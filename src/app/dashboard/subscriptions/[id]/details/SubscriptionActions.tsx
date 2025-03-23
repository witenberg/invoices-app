"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SubscriptionStatus } from "@/types/subscription";
import { ConfirmationModal } from "@/components/ConfirmationModal";

export function SubscriptionActions({ subId, status }: { subId: string; status: SubscriptionStatus }) {
    const router = useRouter();

    const updateStatus = async () => {
        const newStatus = status === "Paused" ? "Active" : "Paused";
        try {
            const response = await fetch(`/api/subscriptions/${subId}/update-status/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error("Error updating subscription status");
            }

            router.refresh();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Edit</Button>

            <ConfirmationModal
                message="Are you sure you want to change the subscription status?"
                confirmText={status === "Paused" ? "Activate" : "Pause"}
                onConfirm={updateStatus}
            >
                <Button className="w-full bg-white-600 text-blue-600 border hover:border-black hover:bg-white">
                    {status === "Paused" ? "Activate" : "Pause"}
                </Button>
            </ConfirmationModal>

            <Button className="w-full bg-white-600 text-blue-600 border hover:border-black hover:bg-white">Client</Button>
            <Button className="w-full bg-white-600 text-red-600 border hover:border-black hover:bg-white">Delete</Button>
        </div>
    );
}
