import { NextResponse } from "next/server"
import pool from "@/lib/db"
import type { InvoiceStatus } from "@/types/invoice"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId") // Odczytanie userId z parametrów zapytania
  const status = searchParams.get("status") as InvoiceStatus | null
  console.log(userId);  // Teraz userId powinno być dostępne



  const client = await pool.connect()
  try {
    let query =
      "SELECT i.*, c.name as client_name FROM invoices i JOIN clients c ON i.clientid = c.clientid WHERE i.userid = $1"
    const values: any[] = [userId]

    if (status) {
      query += " AND i.status = $2"
      values.push(status)
    }

    query += " ORDER BY i.date DESC"

    const result = await client.query(query, values)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching data from db: ", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    client.release()
  }
}

