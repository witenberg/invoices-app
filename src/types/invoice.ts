export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Refunded' | 'Deleted';

export interface Invoice {
  invoiceid: string
  userid: string
  clientid: string
  status: InvoiceStatus
  currency: string
  date: string
  notes?: string
  discount?: number
  salestax?: number
  secondtax?: number
  acceptcreditcards: boolean
  acceptpaypal: boolean
};


