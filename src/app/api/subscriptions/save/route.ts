import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { Subscription } from "@/types/subscription";
import { InvoiceItem } from "@/types/invoiceItem";
import { makeInvoice } from "@/app/actions/invoices";
import { getNextSubscriptionDate } from "@/app/actions/subscriptions";

export async function POST(request: Request) {
  const sub: Subscription = await request.json();
  const date = new Date();
  
  const client = await pool.connect();
  try {
    let subid = sub.subscriptionid;

    if (subid) {
      const next_invoice = getNextSubscriptionDate(sub.start_date, sub.frequency)
      console.log("next_invoice: ", next_invoice)

      await client.query(
        `UPDATE subscriptions SET 
          userid = $1, clientid = $2, status = $3, currency = $4, 
          language = $5, notes = $6, discount = $7, 
          salestax = $8, secondtax = $9, acceptcreditcards = $10, acceptpaypal = $11, 
          start_date = $12, frequency = $13, end_date = $14, products = $14, next_invoice = $15 
         WHERE subscriptionid = $16`,
        [
          sub.invoicePrototype.userid,
          sub.invoicePrototype.clientid,
          sub.status,
          sub.invoicePrototype.currency,
          sub.invoicePrototype.language,
          sub.invoicePrototype.notes,
          sub.invoicePrototype.discount,
          sub.invoicePrototype.salestax,
          sub.invoicePrototype.secondtax,
          sub.invoicePrototype.acceptcreditcards,
          sub.invoicePrototype.acceptpaypal,
          sub.start_date,
          sub.frequency,
          sub.end_date,
          JSON.stringify(
            sub.invoicePrototype.products.map((item: InvoiceItem) => ({
              id: item.id,
              name: item.name,
              amount: item.amount,
              quantity: item.quantity ?? 1
            }))
          ),
          next_invoice,
          subid,
        ]
      );

    } else {
      const subscriptionResult = await client.query(
        `INSERT INTO subscriptions (
          userid, clientid, status, currency, language, notes, 
          discount, salestax, secondtax, acceptcreditcards, acceptpaypal, 
          start_date, frequency, end_date, products
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
        RETURNING subscriptionid`,
        [
          sub.invoicePrototype.userid,
          sub.invoicePrototype.clientid,
          sub.status,
          sub.invoicePrototype.currency,
          sub.invoicePrototype.language,
          sub.invoicePrototype.notes,
          sub.invoicePrototype.discount,
          sub.invoicePrototype.salestax,
          sub.invoicePrototype.secondtax,
          sub.invoicePrototype.acceptcreditcards,
          sub.invoicePrototype.acceptpaypal,
          sub.start_date,
          sub.frequency,
          sub.end_date,
          JSON.stringify(
            sub.invoicePrototype.products.map((item: InvoiceItem) => ({
              id: item.id,
              name: item.name,
              amount: item.amount,
              quantity: item.quantity ?? 1
            }))
          ),
        ]
      );

      subid = subscriptionResult.rows[0].subscriptionid;
    }

    console.log("start_date: ", sub.start_date)
    console.log("today_date: ", date.toISOString().split("T")[0])
    if (sub.start_date == date.toISOString().split("T")[0]) {
      console.log("warunek spelniony!!!")
      makeInvoice(sub.invoicePrototype, subid);
    }
    return NextResponse.json({ success: true, subid });
  } catch (error) {
    console.error("Error saving subscription:", error);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  } finally {
    client.release();
  }
}



