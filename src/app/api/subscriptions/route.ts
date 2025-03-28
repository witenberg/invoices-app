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
      `SELECT s.subscriptionid, s.status, s.currency, s.frequency, s.next_invoice,
       c.name as client_name, COALESCE(
        (SELECT SUM((p->>'amount')::numeric * (p->>'quantity')::numeric) 
         FROM jsonb_array_elements(s.products) AS p), 0
      ) AS total
       FROM subscriptions s 
       JOIN clients c ON s.clientid = c.clientid 
       WHERE s.userid = $1 `
    const values: any[] = [userId]

    if (status) {
      query += "AND s.status = $2 "
      values.push(status)
    }

    query += "GROUP BY s.subscriptionid, s.status, s.currency, s.frequency, s.next_invoice, c.name" // order by

    const result = await client.query(query, values)
    // console.log(result.rows)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching data from db: ", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    client.release()
  }
}

