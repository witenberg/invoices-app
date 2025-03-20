import { SubscriptionFrequency } from "@/types/subscription";

export function ScheduleSummary({ nextInvoice, frequency, totalRevenue, totalInvoices }: { nextInvoice: string; frequency: SubscriptionFrequency; totalRevenue: number; totalInvoices: number }) {
    return (
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="grid grid-cols-[1fr_3fr] gap-y-8 p-2">
          <div className="text-sm text-gray-600 font-semibold">Next Invoice</div>
          <div className="text-sm">{nextInvoice || "-"}</div>
  
          <div className="text-sm text-gray-600 font-semibold">Frequency</div>
          <div className="text-sm">{frequency}</div>
  
          <div className="text-sm text-gray-600 font-semibold">Total Revenue</div>
          <div className="text-sm">{totalRevenue}</div>
  
          <div className="text-sm text-gray-600 font-semibold">Total Invoices</div>
          <div className="text-sm">{totalInvoices}</div>
        </div>
      </div>
    );
  }