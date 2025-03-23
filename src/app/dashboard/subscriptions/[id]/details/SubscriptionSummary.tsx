import { Currency } from "@/constants/options";
import { SubscriptionFrequency, SubscriptionStatus } from "@/types/subscription";

export function SubscriptionSummary({ status, currency, total, frequency, client_name }: 
    { status: SubscriptionStatus, currency: Currency, total: number, frequency: SubscriptionFrequency, client_name: string}) {
    return (
      <div className="bg-white p-6">
        <div className="text-sm text-gray-500">{status.toUpperCase()}</div>
        <div className="text-2xl font-bold">{currency} {Number(total).toFixed(2)}</div>
        <div className="text-gray-600">{frequency}</div>
        <div className="text-gray-900">{client_name}</div>
      </div>
    )
  }
  
  