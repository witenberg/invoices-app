export type SubscriptionStatus = 'Active' | 'Paused' | 'Deleted';

export type SubscriptionFrequency = 'Weekly' | 'Every 2 weeks' | 'Every 4 weeks' | 'Monthly' | 'Quarterly' | 'Every 6 months' | 'Yearly'

export interface Subscription {
    subscriptionid?: number
    invoiceid: number
    start_date: string
    frequency: SubscriptionFrequency
    end_date?: string
    status: SubscriptionStatus
  }