import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { Invoice } from "@/types/invoice";
import { InvoiceItem } from "@/types/invoiceItem";
import { sendInvoiceEmail } from "@/app/actions/email";

export async function POST(request: Request) {
  const invoice: Invoice = await request.json();
  console.log(invoice)
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let invoiceid = invoice.invoiceid;

    if (invoiceid) {
      await client.query(
        `UPDATE invoices SET 
            userid = $1, clientid = $2, status = $3, currency = $4, 
            language = $5, date = $6, notes = $7, discount = $8, 
            salestax = $9, secondtax = $10, acceptcreditcards = $11, 
            acceptpaypal = $12, subscriptionid = $13, products = $14
          WHERE invoiceid = $15`,
        [
          invoice.userid,
          invoice.clientid,
          invoice.status,
          invoice.options.currency,
          invoice.options.language,
          invoice.options.date,
          invoice.options.notes,
          invoice.options.discount,
          invoice.options.salestax?.rate,
          invoice.options.secondtax?.rate,
          invoice.options.acceptcreditcards,
          invoice.options.acceptpaypal,
          invoice.subscriptionid,
          JSON.stringify(
            invoice.items.map((item: InvoiceItem) => ({
              id: item.id,
              name: item.name,
              amount: item.amount,
              quantity: item.quantity ?? 1
            }))
          ),
          invoiceid,
        ]
      );
    }
    else {
      const result = await client.query(`
          INSERT INTO invoices (
          userid, clientid, status, currency, language, date, notes, 
          discount, salestax, secondtax, acceptcreditcards, acceptpaypal, subscriptionid, products
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
        RETURNING invoiceid
        `, [
        invoice.userid,
        invoice.clientid,
        invoice.status,
        invoice.options.currency,
        invoice.options.language,
        invoice.options.date,
        invoice.options.notes,
        invoice.options.discount,
        invoice.options.salestax?.rate,
        invoice.options.secondtax?.rate,
        invoice.options.acceptcreditcards,
        invoice.options.acceptpaypal,
        invoice.subscriptionid,
        JSON.stringify(
          invoice.items.map((item: InvoiceItem) => ({
            id: item.id,
            name: item.name,
            amount: item.amount,
            quantity: item.quantity ?? 1
          }))
        ),
      ]
      )
      invoiceid = result.rows[0].invoiceid
    }
    if (invoice.options.date === new Date().toISOString().split("T")[0] && invoiceid) 
      sendInvoiceEmail(invoiceid.toString())

    await client.query("COMMIT");
    return NextResponse.json({ success: true, invoiceid });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saving invoice:", error);
    return NextResponse.json({ error: "Failed to save invoice" }, { status: 500 });
  } finally {
    client.release();
  }
}