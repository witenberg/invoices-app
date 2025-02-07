export interface InvoiceItem {
    id: string
    description: string
    amount: number | null
    quantity?: number
}  