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
      "SELECT s.subscriptionid, s.status, s.currency, s.frequency, c.name as client_name, COALESCE(SUM(p.amount * p.quantity), 0) as total FROM subscriptions s JOIN clients c ON s.clientid = c.clientid LEFT JOIN productsonsubscription p ON s.subscriptionid = p.subscriptionid WHERE s.userid = $1 "
    const values: any[] = [userId]

    if (status) {
      query += "AND i.status = $2 "
      values.push(status)
    }

    query += "GROUP BY s.subscriptionid, s.status, s.currency, s.frequency, c.name" // order by

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

