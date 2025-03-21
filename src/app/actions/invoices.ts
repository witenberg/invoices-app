import { Invoice, InvoicePrototype } from "@/types/invoice";
import { InvoiceItem } from "@/types/invoiceItem";

export async function makeInvoice(invoice: InvoicePrototype, subId?: number) {
    const fullInvoice: Invoice = {
        userid: invoice.userid,
        clientid: invoice.clientid,
        status: "Sent",
        options: {
            currency: invoice.currency,
            language: invoice.language,
            date: new Date().toISOString().split("T")[0],
            notes: invoice.notes,
            discount: invoice.discount,
            acceptcreditcards: invoice.acceptcreditcards,
            acceptpaypal: invoice.acceptpaypal
        },
        items: invoice.products.map((item: InvoiceItem) => ({
            id: item.id,
            name: item.name,
            amount: item.amount,
            quantity: item.quantity ?? 1,
        })),
        subscriptionid: subId
    }

    try {
        const response = await fetch(`${process.env.BASE_URL}/api/invoices/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(fullInvoice),
        })

        if (!response.ok) {
            throw new Error("Failed to save invoice")
        }
        const data = await response.json()
        return data.invoiceid
    } catch (error) {
        console.error("Error saving invoice:", error)
    }
}
