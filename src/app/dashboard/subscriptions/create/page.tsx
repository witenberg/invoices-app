'use client'

import { CreateSubscriptionForm } from "./CreateSubscriptionForm"

export default function CreateInvoicePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">New Subscription</h1>
      <CreateSubscriptionForm />
    </div>
  )
}

