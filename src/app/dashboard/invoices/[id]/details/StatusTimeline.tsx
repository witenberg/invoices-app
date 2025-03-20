import { FileText, Mail, Eye, CreditCard } from 'lucide-react'

export function StatusTimeline({ invoice }: { invoice: any }) {
  const states = [
    {
      name: "CREATED",
      icon: FileText,
      date: new Date(invoice.date).toLocaleDateString(),
      reached: true,
    },
    {
      name: "SENT",
      icon: Mail,
      date: invoice.sent_at ? new Date(invoice.sent_at).toLocaleDateString() : "not yet",
      reached: ["Sent", "Opened", "Paid"].includes(invoice.status),
    },
    {
      name: "OPENED",
      icon: Eye,
      date: invoice.opened_at ? new Date(invoice.opened_at).toLocaleDateString() : "not yet",
      reached: ["Opened", "Paid"].includes(invoice.status),
    },
    {
      name: "PAID",
      icon: CreditCard,
      date: invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString() : "not yet",
      reached: invoice.status === "Paid",
    },
  ]

  return (
      <div className="bg-white p-4 md:p-8 rounded-md">
        <div className="relative">
          <div className="gap-x-4 flex items-center justify-between">
            {states.map((state) => (
              <div 
                key={state.name}
                className={`grow-0 gap-y-3 z-10 flex flex-col items-center text-sm`}
              >
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  state.reached ? 'bg-blue-900 text-white' : 'bg-white border border-gray-200'
                }`}>
                  <state.icon className="w-5 h-5" />
                </div>
                <div className="text-xs text-center mt-2">
                  <div className="text-blue-900 font-bold tracking-wider uppercase">{state.name}</div>
                  <div className="mt-1 text-gray-500">{state.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}