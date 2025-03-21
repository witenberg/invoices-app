import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { InvoiceStatus } from "@/types/invoice";
import type { InvoiceToEdit } from "@/types/invoice";
import { Subscription, SubscriptionStatus } from "@/types/subscription";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const client = await pool.connect();

    try {
        const subQuery = `
      SELECT s.*, c.name as client_name, c.email as client_email, c.address as client_address 
      FROM subscriptions s
      JOIN clients c ON s.clientid = c.clientid 
      WHERE s.subscriptionid = $1;
    `;
        const subResult = await client.query(subQuery, [id]);

        if (subResult.rows.length === 0) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }

        const subRow = subResult.rows[0];

        const subData: Subscription = {
            subscriptionid: subRow.subscriptionid,
            start_date: subRow.start_date,
            frequency: subRow.frequency,
            end_date: subRow.end_date || undefined,
            status: subRow.status as SubscriptionStatus,
            invoicePrototype: {
                userid: subRow.userid,
                clientid: subRow.clientid,
                currency: subRow.currency,
                language: subRow.language,
                notes: subRow.notes || undefined,
                discount: subRow.discount || undefined,
                salestax: subRow.salestax,
                secondtax: subRow.secondtax,
                acceptcreditcards: subRow.acceptcreditcards || undefined,
                acceptpaypal: subRow.acceptpaypal || undefined,
                client: {
                    name: subRow.client_name,
                    email: subRow.client_email,
                    address: subRow.client_address || undefined,
                },
                products: subRow.products
            }
        };

        return NextResponse.json(subData);
    } catch (error) {
        console.error("Error fetching data from db: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        client.release();
    }
}