import pool from "@/lib/db"
import { notFound } from "next/navigation"
import { FinancialSummary } from "./FinancialSummary";
import { InvoiceActions } from "./InvoiceActions";
import { ItemsSummary } from "../../../../../components/dahboard/details/ItemsSummary";
import { Payments } from "./Payments";
import { StatusTimeline } from "./StatusTimeline";
import { InvoiceSummary } from "./InvoiceSummary";


async function getInvoice(id: string) {
    const client = await pool.connect();
    try {
        const invoice = await client.query(`
      SELECT i.*, c.name as client_name, c.email as client_email, COALESCE(SUM(p.amount * p.quantity), 0) as total
      FROM invoices i
      JOIN clients c ON i.clientid = c.clientid
      LEFT JOIN productsoninvoice p ON i.invoiceid = p.invoiceid
      WHERE i.invoiceid = $1
      GROUP BY i.invoiceid, c.name, c.email
    `, [id])
        // console.log(invoice.rows[0])
        return invoice.rows[0]
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch invoice")
    } finally {
        client.release()
    }
}


export default async function InvoiceDetailsPage({
    params
}: { params: { id: string } }) {
    const { id } = await params
    const invoice = await getInvoice(id)

    if (!invoice) {
        notFound()
    }

    return (
        <div className="flex flex-col max-w-7xl mx-auto bg-white">
            <div className="border-b pb-4 px-6 pt-6">
                <h1 className="text-2xl font-bold text-blue-800">Invoice {id}</h1>
            </div>

            <div className="flex p-6 gap-6">
                <div className="flex-1 space-y-8">
                    <div className="bg-white rounded-lg border shadow-sm">
                        <StatusTimeline invoice={invoice} />
                    </div>

                    <div className="bg-white rounded-lg border shadow-sm">
                        <FinancialSummary invoice={invoice} />
                    </div>

                    <div className="bg-white rounded-lg border shadow-sm">
                        <ItemsSummary type="invoice" id={id} />
                    </div>

                    <div className="bg-white rounded-lg border shadow-sm">
                        <Payments />
                    </div>
                </div>

                <div className="w-80 sticky top-6 self-start">
                    <div className="bg-white rounded-lg border shadow-sm">
                        <div className="p-6">
                            <InvoiceSummary invoice={invoice} />
                        </div>
                        <div className="p-6 pt-0">
                            <InvoiceActions invoiceId={id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}