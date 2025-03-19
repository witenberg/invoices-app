import { Items, getItems } from "./Items";
import pool from "@/lib/db"

async function getSub(id: string) {
    try {
        const client = await pool.connect();
        const sub = await client.query(`
      SELECT s.*, c.name as client_name, c.email as client_email
      FROM subscriptions s
      JOIN clients c ON s.clientid = c.clientid
      WHERE s.subscriptionid = $1
    `, [id])
        return sub.rows[0]
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch subscription")
    }
}

export default async function SubscriptionDetails({
    params
}: { params: { id: string } }) {
    const { id } = await params
    const sub = await getSub(id)


    return (
        <div>
            <Items subId={id} />
        </div>
    )
}