import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { Subscription } from "@/types/subscription";

export async function POST(request: Request) {
  const sub: Subscription = await request.json();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let subid = sub.subscriptionid;

    if (subid) {
      // Tryb edycji - aktualizacja faktury
      await client.query(
        `UPDATE subscriptions SET 
          userid = $1, clientid = $2, status = $3, currency = $4, 
          language = $5, notes = $6, discount = $7, 
          salestax = $8, secondtax = $9, acceptcreditcards = $10, acceptpaypal = $11, 
          start_date = $12, frequency = $13, end_date = $14 
         WHERE subscriptionid = $15`,
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
          subid,
        ]
      );

      // Usuwamy wszystkie produkty powiązane z fakturą
      await client.query(
        "DELETE FROM products WHERE productid IN (SELECT productid FROM productsonsubscription WHERE subscriptionid = $1)",
        [subid]
      );
      await client.query("DELETE FROM productsonsubscription WHERE subscriptionid = $1", [subid]);
    } else {
      // Tryb dodawania - nowa faktura
      const subscriptionResult = await client.query(
        `INSERT INTO subscriptions (
          userid, clientid, status, currency, language, notes, 
          discount, salestax, secondtax, acceptcreditcards, acceptpaypal, 
          start_date, frequency, end_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
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
        ]
      );

      subid = subscriptionResult.rows[0].subscriptionid;
    }

    // Wstawiamy nowe produkty powiązane z fakturą
    for (const item of sub.invoicePrototype.products) {
      const productResult = await client.query(
        `INSERT INTO products (userid, name) 
         VALUES ($1, $2) 
         RETURNING productid`,
        [sub.invoicePrototype.userid, item.description]
      );

      const productid = productResult.rows[0].productid;

      await client.query(
        `INSERT INTO productsonsubscription (subscriptionid, productid, amount, quantity) 
         VALUES ($1, $2, $3, $4)`,
        [subid, productid, item.amount, item.quantity || 1]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ success: true, subid });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error saving subscription:", error);
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  } finally {
    client.release();
  }
}



