"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import type { InvoiceToDisplay } from "@/types/invoice"
import { ExtendedUser } from "@/app/actions/user"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ConfirmationModal } from "@/components/ConfirmationModal"

interface InvoiceListProps {
  subId?: string
}

export function InvoiceList({ subId: propSubId }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<InvoiceToDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get("status")
  const subId = propSubId || searchParams.get("subId")
  const router = useRouter()

  useEffect(() => {
    const fetchInvoices = async () => {
      if (status !== "authenticated" || !(session?.user as ExtendedUser)?.userid) return

      setIsLoading(true)
      const response = await fetch(
        `/api/invoices?${new URLSearchParams({
          userId: (session.user as ExtendedUser).userid,
          status: statusFilter || "",
          subId: subId || "",
        })}`,
      )

      if (response.ok) {
        const data = await response.json()
        setInvoices(data)
      } else {
        console.error("Failed to fetch invoices")
      }
      setIsLoading(false)
    }

    fetchInvoices()
  }, [(session?.user as ExtendedUser)?.userid, statusFilter, status, subId])

  const handleSend = async (invoiceId: number) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log(`Invoice ${invoiceId} sent successfully`);
      } else {
        console.error(`Failed to send invoice ${invoiceId}`);
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
    }
  }

  if (status === "loading") {
    return <div>Loading session...</div>
  }

  if (status === "unauthenticated") {
    return <div>Please log in to view your invoices.</div>
  }

  if (isLoading) {
    return <div>Loading invoices...</div>
  }

  if (invoices.length === 0) {
    return <p>No invoices found.</p>
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
          {!propSubId &&
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
          }
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {invoices.map((invoice) => (
          <tr
            key={invoice.invoiceid}
            onClick={() => router.push(`/dashboard/invoices/${invoice.invoiceid}/details`)}
            className="cursor-pointer hover:bg-gray-100"
          >
            <td className="px-6 py-4 whitespace-nowrap">{invoice.status}</td>
            <td className="px-6 py-4 whitespace-nowrap">{invoice.currency}</td>
            <td className="px-6 py-4 whitespace-nowrap">{invoice.total}</td>
            {!propSubId &&
              <td className="px-6 py-4 whitespace-nowrap">{invoice.client_name}</td>
            }
            <td className="px-6 py-4 whitespace-nowrap">{new Date(invoice.date).toLocaleDateString()}</td>
            {!propSubId &&
              <td className="px-6 py-4 whitespace-nowrap">
              <ConfirmationModal
                message={`Are you sure you want to send invoice #${invoice.invoiceid} to ${invoice.client_name}?`}
                confirmText="Send Invoice"
                onConfirm={() => handleSend(invoice.invoiceid)}
                triggerText="Send"
                triggerClassName="text-blue-600 hover:text-blue-900 mr-2"
              />
              <Link
                href={`/dashboard/invoices/${invoice.invoiceid}/edit`}
                className="text-green-600 hover:text-green-900 mr-2"
                onClick={(e) => e.stopPropagation()}
              >
                Edit
              </Link>
              <button 
                className="text-gray-600 hover:text-gray-900" 
                onClick={(e) => {
                  e.stopPropagation(); 
                  window.open(`/invoices/${invoice.invoiceid}`, '_blank');
                }}
              >
                View
              </button>
            </td>
            }
          </tr>
        ))}
      </tbody>
    </table>
  )
}

