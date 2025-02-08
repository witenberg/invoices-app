import type { InvoiceItem } from "./invoiceItem";

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Refunded' | 'Deleted';

export interface InvoiceOptions {
  currency: string
  language: string
  date: string
  notes?: string
  discount?: number
  isDiscountAmount?: boolean
  salestax?: {
    name: string
    rate: number
  }
  secondtax?: {
    name: string
    rate: number
  }
  acceptcreditcards: boolean
  acceptpaypal: boolean
}

export interface Invoice {
  invoiceid?: number
  userid: number
  clientid: number
  status: InvoiceStatus
  options: InvoiceOptions
  items: InvoiceItem[]
}

export interface InvoiceToDisplay {
  invoiceid: number
  userid: number
  clientid: number
  status: InvoiceStatus
  currency: string
  total: number
  client_name: string
  date: string
}
