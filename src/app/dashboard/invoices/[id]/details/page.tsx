import pool from "@/lib/db"
import { notFound } from "next/navigation"
import { FinancialSummary } from "./FinancialSummary";
import { InvoiceActions } from "./InvoiceActions";
import { getItems, Items } from "./Items";
import { Payments } from "./Payments";
import { StatusTimeline } from "./StatusTimeline";
import { InvoiceSummary } from "./InvoiceSummary";

async function getInvoice(id: string) {
    try {
        const client = await pool.connect();
        const invoice = await client.query(`
      SELECT i.*, c.name as client_name, c.email as client_email
      FROM invoices i
      JOIN clients c ON i.clientid = c.clientid
      WHERE i.invoiceid = $1
    `, [id])
        return invoice.rows[0]
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch invoice")
    }
}


export default async function InvoiceDetailsPage({
    params
}: { params: { id: string } }) {
    const { id } = await params
    const invoice = await getInvoice(id)
    const { total } = await getItems(id)

    if (!invoice) {
        notFound()
    }

    return (
        <div className="flex flex-col gap-4 p-6 max-w-7xl mx-auto">
            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Status Timeline</h2>
                <StatusTimeline invoice={invoice} />
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Financial Summary</h2>
                <FinancialSummary invoice={invoice} />
            </div>

            <div className="flex gap-4">
                <div className="flex-1 bg-gray-100 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Items</h2>
                    <Items invoiceId={id} />
                </div>

                <div className="w-80 space-y-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Invoice Summary</h2>
                        <InvoiceSummary invoice={invoice} total={total} />
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Actions</h2>
                        <InvoiceActions invoiceId={id} />
                    </div>
                </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Payments</h2>
                <Payments />
            </div>
        </div>
    )
}