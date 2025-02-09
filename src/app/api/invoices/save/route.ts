import { NextResponse } from "next/server"
import pool from "@/lib/db"
import type { Invoice } from "@/types/invoice"

export async function POST(request: Request) {
  const invoice: Invoice = await request.json();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let invoiceid = invoice.invoiceid;

    if (invoiceid) {
      // Tryb edycji - aktualizacja faktury
      await client.query(
        `UPDATE invoices SET 
          userid = $1, clientid = $2, status = $3, currency = $4, 
          language = $5, date = $6, notes = $7, discount = $8, 
          salestax = $9, secondtax = $10, acceptcreditcards = $11, acceptpaypal = $12 
         WHERE invoiceid = $13`,
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
          invoiceid,
        ]
      );

      // Usuwamy wszystkie produkty powiązane z fakturą
      await client.query("DELETE FROM productsoninvoice WHERE invoiceid = $1", [invoiceid]);
      await client.query(
        "DELETE FROM products WHERE productid IN (SELECT productid FROM productsoninvoice WHERE invoiceid = $1)",
        [invoiceid]
      );
    } else {
      // Tryb dodawania - nowa faktura
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
        ]
      );

      invoiceid = invoiceResult.rows[0].invoiceid;
    }

    // Wstawiamy nowe produkty powiązane z fakturą
    for (const item of invoice.items) {
      const productResult = await client.query(
        `INSERT INTO products (userid, name) 
         VALUES ($1, $2) 
         RETURNING productid`,
        [invoice.userid, item.description]
      );

      const productid = productResult.rows[0].productid;

      await client.query(
        `INSERT INTO productsoninvoice (invoiceid, productid, amount, quantity) 
         VALUES ($1, $2, $3, $4)`,
        [invoiceid, productid, item.amount, item.quantity || 1]
      );
    }

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



