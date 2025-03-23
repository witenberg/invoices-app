import { sendInvoiceEmail } from "@/app/actions/email"
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        if (!id) {
            return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
        }

        const result = await sendInvoiceEmail(id);
        
        if (result.success) {
            return NextResponse.json({ message: "Successfully sent invoice" }, { status: 200 });
        } else {
            return NextResponse.json("Failed to send invoice", { status: 500 });
        }
    } catch (error) {
        console.error("Error sending invoice:", error);
        return NextResponse.json({ 
            error: "An unexpected error occurred while sending the invoice" 
        }, { status: 500 });
    }
}