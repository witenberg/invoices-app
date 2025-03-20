export function InvoiceSummary({ invoice }: { invoice: any }) {
    return (
      <div className="bg-white p-6">
        <div className="text-sm text-gray-500">{invoice.status.toUpperCase()}</div>
        <div className="text-2xl font-bold">USD {Number(invoice.total).toFixed(2)}</div>
        <div className="text-gray-600">{invoice.client_name}</div>
      </div>
    )
  }
  
  