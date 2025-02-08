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
    // console.log(result.rows);
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    client.release()
  }
}


export async function POST(request: Request) {
  const client = await request.json()
  const dbClient = await pool.connect()

  try {
    const result = await dbClient.query(
      `INSERT INTO clients (userid, name, email, address) 
       VALUES ($1, $2, $3, $4) 
       RETURNING clientid`,
      [client.userId, client.name, client.email, client.address || '' ]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
  } finally {
    dbClient.release()
  }
}

