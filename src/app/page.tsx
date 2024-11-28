import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simplify Your Invoicing Process</h1>
          <p className="text-xl text-gray-600 mb-8">Create, send, and manage invoices with ease. Get paid faster and grow your business.</p>
          <div className="flex justify-center space-x-4">
            <Button asChild>
              <Link href="/features">Explore Features</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <img src="/placeholder.jpg" alt="InvoiceApp Dashboard" className="rounded-lg shadow-xl" />
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-black font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">Create professional invoices in minutes with our intuitive interface.</p>
          </div>
          <div className="text-center">
            <h3 className="text-black font-semibold mb-2">Get Paid Faster</h3>
            <p className="text-gray-600">Accept online payments and automate reminders for overdue invoices.</p>
          </div>
          <div className="text-center">
            <h3 className="text-black font-semibold mb-2">Powerful Reporting</h3>
            <p className="text-gray-600">Gain insights into your business with detailed financial reports.</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <blockquote className="text-2xl font-semibold italic text-gray-900">
            "InvoiceApp has revolutionized our billing process. It's a game-changer for small businesses."
          </blockquote>
          <p className="mt-4 text-gray-600">- John Doe, CEO of TechCorp</p>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl text-black font-semibold mb-4">Integrated with Your Favorite Payment Methods</h2>
          <div className="flex justify-center space-x-8">
            <img src="/stripe.svg" alt="Visa" className="h-12" />
            <img src="/paypal.svg" alt="Mastercard" className="h-12" />
            <img src="/apple-pay.svg" alt="PayPal" className="h-12" />
            <img src="/google-pay.svg" alt="Stripe" className="h-12" />
          </div>
        </div>
      </main>
    </div>
  )
}

