export function FinancialSummary({ invoice }: { invoice: any }) {
    return (
      <div className="grid grid-cols-3 gap-4 mt-2">
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-blue-600 font-semibold">PAID</div>
          <div className="text-xl">{invoice.paid_amount || "0.00"}</div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-blue-600 font-semibold">DUE</div>
          <div className="text-xl">{Number(invoice.total) - Number(invoice.paid_amount) || "todo" }</div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-blue-600 font-semibold">REFUNDED</div>
          <div className="text-xl">{invoice.refunded_amount || "0.00"}</div>
        </div>
      </div>
    )
  }
  
  