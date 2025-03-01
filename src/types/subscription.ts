export type SubscriptionStatus = 'Active' | 'Paused' | 'Deleted';

export interface Subscription {
    subscriptionid?: number
    invoiceid: number
    start_date: string
    frequency: string
    end_date?: string
    status: SubscriptionStatus
  }