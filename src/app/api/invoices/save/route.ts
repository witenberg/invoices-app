import { NextResponse } from "next/server"
import pool from "@/lib/db"
import type { Invoice } from "@/types/invoice"

export async function POST(request: Request) {
  const invoice: Invoice = await request.json()
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    const invoiceResult = await client.query(
      `INSERT INTO invoices (
        userid, clientid, status, currency, language, date, notes, 
        discount, salestax, secondtax, acceptcreditcards, acceptpaypal
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING invoiceid`,
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
      ],
    )

    const invoiceid = invoiceResult.rows[0].invoiceid

    // Insert products and connect them to the invoice
    for (const item of invoice.items) {
      const productResult = await client.query(
        `INSERT INTO products (userid, name) 
         VALUES ($1, $2) 
         RETURNING productid`,
        [invoice.userid, item.description],
      )

      const productid = productResult.rows[0].productid

      await client.query(
        `INSERT INTO productsoninvoice (invoiceid, productid, amount, quantity) 
         VALUES ($1, $2, $3, $4)`,
        [invoiceid, productid, item.amount, item.quantity || 1],
      )
    }

    await client.query("COMMIT")
    return NextResponse.json({ success: true, invoiceid })
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error saving invoice:", error)
    return NextResponse.json({ error: "Failed to save invoice" }, { status: 500 })
  } finally {
    client.release()
  }
}

