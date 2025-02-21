export function InvoiceSummary({ invoice, total }: { invoice: any; total: number }) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="text-sm text-gray-500">{invoice.status.toUpperCase()}</div>
        <div className="text-2xl font-bold">USD {total.toFixed(2)}</div>
        <div className="text-gray-600">{invoice.client_name}</div>
      </div>
    )
  }
  
  