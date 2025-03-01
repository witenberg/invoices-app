import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { SubscriptionStatus } from "@/types/subscription"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const status = searchParams.get("status") as SubscriptionStatus | null

  const client = await pool.connect()
  try {
    let query =
      "SELECT i.*, c.name as client_name, COALESCE(SUM(p.amount * p.quantity), 0) as total, s.* FROM invoices i JOIN clients c ON i.clientid = c.clientid LEFT JOIN productsoninvoice p ON i.invoiceid = p.invoiceid JOIN subscriptions s ON i.invoiceid = s.invoiceid WHERE i.userid = $1 "
    const values: any[] = [userId]

    if (status) {
      query += "AND s.status = $2 "
      values.push(status)
    }

    query += "GROUP BY i.invoiceid, s.subscriptionid, c.name ORDER BY i.date DESC"

    const result = await client.query(query, values)
    console.log(result.rows)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching data from db: ", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    client.release()
  }
}

