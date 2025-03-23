import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { subscription_statuses } from "@/constants/statuses";

export async function PUT(request: Request) {
    const url = new URL(request.url);
    const id = url.pathname.split("/").slice(-2, -1)[0];
    
    console.log(id)

    const { status } = await request.json();
    console.log(status)

    if (!Object.values(subscription_statuses).includes(status)) {
        return NextResponse.json({ error: "Incorrect subscription status" }, { status: 400 });
    }

    const client = await pool.connect();

    try {
        const updateQuery = `
            UPDATE subscriptions
            SET status = $1
            WHERE subscriptionid = $2
            RETURNING status;
        `;

        const result = await client.query(updateQuery, [status, id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Subscription status updated",
            subscription: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating subscription status:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        client.release();
    }
}
