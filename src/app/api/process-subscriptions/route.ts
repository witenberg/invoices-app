import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { makeInvoice } from "@/app/actions/invoices";
import { getNextSubscriptionDate } from "@/app/actions/subscriptions";

export async function POST(request: Request) {
    const today_date = new Date().toISOString().split("T")[0];

    const client = await pool.connect();
    try {
        const result = await client.query(
            `SELECT * FROM subscriptions WHERE next_invoice = $1 AND status = 'Active'`,
            [today_date]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ success: false, message: "No subscriptions to process today" });
        }

        const subscriptions = result.rows.map(row => {
            return {
                subscriptionid: row.subscriptionid,
                start_date: row.start_date,
                frequency: row.frequency,
                next_invoice: row.next_invoice,
                end_date: row.end_date,
                invoicePrototype: {
                    userid: row.userid,
                    clientid: row.clientid,
                    currency: row.currency,
                    language: row.language,
                    notes: row.notes,
                    discount: row.discount,
                    salestax: row.salestax,
                    secondtax: row.secondtax,
                    acceptcreditcards: row.acceptcreditcards,
                    acceptpaypal: row.acceptpaypal,
                    products: row.products,
                    client: {
                        name: "",
                        email: "",
                    }
                }
            }
        })

        for (const sub of subscriptions) {
            await makeInvoice(sub.invoicePrototype, sub.subscriptionid);

            const next_invoice = getNextSubscriptionDate(sub.start_date, sub.frequency);

            if (next_invoice > sub.end_date) {
                await client.query(
                    `UPDATE subscriptions SET status = 'Paused' WHERE subscriptionid = $1`,
                    [sub.subscriptionid]
                );
            } else {
                await client.query(
                    `UPDATE subscriptions SET next_invoice = $1 WHERE subscriptionid = $2`,
                    [next_invoice, sub.subscriptionid]
                );
            }
        }

        return NextResponse.json({ success: true, message: "Invoices processed successfully" });
    } catch (error) {
        console.error("Error processing subscriptions:", error);
        return NextResponse.json({ error: "Failed to process subscriptions" }, { status: 500 });
    } finally {
        client.release();
    }
}
