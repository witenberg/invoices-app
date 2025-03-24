import { sendInvoiceEmail } from "@/app/actions/email"
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    let client;

    try {
        if (!id) {
            return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
        }

        const emailResult = await sendInvoiceEmail(id);

        if (!emailResult.success) {
            return NextResponse.json({ 
                error: "Failed to send invoice email" 
            }, { status: 500 });
        }

        client = await pool.connect();

        const updateQuery = `
            UPDATE invoices
            SET status = 'Sent'
            WHERE invoiceid = $1
            RETURNING status;
        `;

        const updateResult = await client.query(updateQuery, [id]);

        if (updateResult.rowCount === 0) {
            return NextResponse.json({ 
                error: "Invoice not found" 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "Successfully sent invoice", 
            status: updateResult.rows[0].status 
        }, { status: 200 });
    }
    catch (error) {
        console.error("Error sending invoice:", error);
        
        if (error instanceof Error) {
            return NextResponse.json({
                error: error.message || "An unexpected error occurred while sending the invoice"
            }, { status: 500 });
        }

        return NextResponse.json({
            error: "An unexpected error occurred while sending the invoice"
        }, { status: 500 });
    }
    finally {
        if (client) {
            client.release();
        }
    }
}