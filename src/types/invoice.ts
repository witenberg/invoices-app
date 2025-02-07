import type { InvoiceItem } from "./invoiceItem";

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Refunded' | 'Deleted';

// export interface Invoice {
//   invoiceid: string
//   userid: string
//   clientid: string
//   status: InvoiceStatus
//   currency: string
//   date: string
//   notes?: string
//   discount?: number
//   salestax?: number
//   secondtax?: number
//   acceptcreditcards: boolean
//   acceptpaypal: boolean
// };

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
