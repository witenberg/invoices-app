import { FileText, Mail, Eye, CreditCard } from "lucide-react"

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
    <div className="bg-white rounded-lg shadow-sm p-8 relative">
      <div className="flex justify-between items-center gap-4">
        {states.map((state, index) => (
          <div key={state.name} className="flex-1 flex flex-col items-center z-10">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 
                ${state.reached ? "bg-blue-900 text-white" : "bg-white border-2 border-blue-100"}`}
            >
              <state.icon className={`w-6 h-6 ${state.reached ? "text-white" : "text-blue-400"}`} />
            </div>
            <div className="text-sm font-semibold text-gray-900">{state.name}</div>
            <div className="text-sm text-gray-500">{state.date}</div>
          </div>
        ))}
      </div>
      <div
        className="absolute h-[2px] bg-gray-200 top-14 left-0 right-0 mx-12"
        style={{
          background: `linear-gradient(to right, 
            #1e3a8a ${states[0].reached ? "25%" : "0%"}, 
            #1e3a8a ${states[1].reached ? "50%" : "25%"}, 
            #1e3a8a ${states[2].reached ? "75%" : "50%"}, 
            #1e3a8a ${states[3].reached ? "100%" : "75%"}, 
            #e5e7eb 100%)`,
        }}
      />
    </div>
  )
}

