import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  const client = await pool.connect()
  try {
    const query = `
      SELECT DISTINCT c.*
      FROM clients c
      JOIN invoices i ON c.clientid = i.clientid
      WHERE i.userid = $1
      ORDER BY c.name
    `
    const result = await client.query(query, [userId])
    console.log(result.rows)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    client.release()
  }
}

