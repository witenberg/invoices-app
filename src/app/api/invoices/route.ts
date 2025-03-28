import { NextResponse } from "next/server"
import pool from "@/lib/db"
import type { InvoiceStatus } from "@/types/invoice"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const status = searchParams.get("status") as InvoiceStatus | null
  const subId = searchParams.get("subId") as Number | null

  const client = await pool.connect()
  try {
    let query =
      `SELECT i.*, c.name as client_name, 
      COALESCE(
        (SELECT SUM((p->>'amount')::numeric * (p->>'quantity')::numeric) 
         FROM jsonb_array_elements(i.products) AS p), 0
      ) AS total
      FROM invoices i
      JOIN clients c ON i.clientid = c.clientid
      WHERE i.userid = $1 `
    const values: any[] = [userId]

    if (status) {
      values.push(status);
      query += `AND i.status = $${values.length} `;
    }

    if (subId) {
      values.push(subId);
      query += `AND i.subscriptionid = $${values.length} `;
    }

    query += "GROUP BY i.invoiceid, c.name ORDER BY i.date DESC"

    const result = await client.query(query, values)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching data from db: ", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    client.release()
  }
}

