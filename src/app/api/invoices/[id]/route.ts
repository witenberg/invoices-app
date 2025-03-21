import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { InvoiceStatus } from "@/types/invoice";
import type { InvoiceToEdit } from "@/types/invoice";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const client = await pool.connect();

    try {
        const invoiceQuery = `
      SELECT i.*, c.name as client_name, c.email as client_email, c.address as client_address,
             i.salestax, i.secondtax
      FROM invoices i 
      JOIN clients c ON i.clientid = c.clientid 
      WHERE i.invoiceid = $1;
    `;
        const invoiceResult = await client.query(invoiceQuery, [id]);

        if (invoiceResult.rows.length === 0) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        const invoiceRow = invoiceResult.rows[0];

        const invoiceData: InvoiceToEdit = {
            invoiceid: invoiceRow.invoiceid,
            userid: invoiceRow.userid,
            clientid: invoiceRow.clientid,
            status: invoiceRow.status as InvoiceStatus,
            currency: invoiceRow.currency,
            language: invoiceRow.language,
            date: invoiceRow.date,
            notes: invoiceRow.notes || undefined,
            discount: invoiceRow.discount || undefined,
            salestax: invoiceRow.salestax,
            secondtax: invoiceRow.secondtax,
            acceptcreditcards: invoiceRow.acceptcreditcards,
            acceptpaypal: invoiceRow.acceptpaypal,
            client: {
                name: invoiceRow.client_name,
                email: invoiceRow.client_email,
                address: invoiceRow.client_address || undefined,
            },
            products: invoiceRow.products
        };

        return NextResponse.json(invoiceData);
    } catch (error) {
        console.error("Error fetching data from db: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        client.release();
    }
}