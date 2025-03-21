import { ItemsSummary } from "@/components/dahboard/details/ItemsSummary";
import { ScheduleSummary } from "./ScheduleSummary";
import pool from "@/lib/db"
import InvoicesSummary from "./InvoicesSummary";

async function getSub(id: string) {
    const client = await pool.connect();
    try {
        const sub = await client.query(`
      SELECT s.*, c.name as client_name, c.email as client_email
      FROM subscriptions s
      JOIN clients c ON s.clientid = c.clientid
      WHERE s.subscriptionid = $1
    `, [id])
        return sub.rows[0]
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch subscription")
    } finally {
        client.release()
    }
}

export default async function SubscriptionDetails({
    params
}: { params: { id: string } }) {
    const { id } = await params
    const sub = await getSub(id)
    console.log(sub)


    return (
            <div className="flex flex-col max-w-7xl mx-auto bg-white">
                <div className="border-b pb-4 px-6 pt-6">
                    <h1 className="text-2xl font-bold text-blue-800">Subscription {id}</h1>
                </div>
                
                <div className="flex p-6 gap-6">
                    <div className="flex-1 space-y-8">
                        <div className="bg-white rounded-lg border shadow-sm">
                            <ScheduleSummary 
                            nextInvoice={sub.next_invoice.toLocaleDateString()} 
                            frequency={sub.frequency} 
                            totalRevenue={1} 
                            totalInvoices={3} 
                            endDate={sub.endDate?.toLocaleDateString()} 
                            />
                        </div>
    
                        <div className="bg-white rounded-lg border shadow-sm">
                            <ItemsSummary type="subscription" id={id} />
                        </div>
    
                        <div className="bg-white rounded-lg border shadow-sm">
                            <InvoicesSummary id={id}/>
                        </div>
                    </div>
    
                    <div className="w-80 sticky top-6 self-start">
                        <div className="bg-white rounded-lg border shadow-sm">
                            <div className="p-6">
                                {/* <InvoiceSummary invoice={invoice} /> */}
                            </div>
                            <div className="p-6 pt-0">
                                {/* <InvoiceActions invoiceId={id} /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}