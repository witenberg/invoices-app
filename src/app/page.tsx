import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/Hero'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Hero
        title="Simplify Your Invoicing Process"
        description="Create, send, and manage invoices with ease. Get paid faster and grow your business."
      >
        <Button asChild variant="outline" >
          <Link href="/features">Explore Features</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/signup">Start Free Trial</Link>
        </Button>
      </Hero>

      <div className="container mx-auto px-6 py-8">
        <div className="mt-16">
          <img src="/placeholder.jpg" alt="InvoiceApp Dashboard" className="rounded-lg shadow-xl" />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Easy to Use"
            description="Create professional invoices in minutes with our intuitive interface."
          />
          <FeatureCard
            title="Get Paid Faster"
            description="Accept online payments and automate reminders for overdue invoices."
          />
          <FeatureCard
            title="Powerful Reporting"
            description="Gain insights into your business with detailed financial reports."
          />
        </div>

        <Testimonial
          quote="SimpleInvoices has revolutionized our billing process. It's a game-changer for small businesses."
          author="John Doe, CEO of TechCorp"
        />

        <PaymentMethods />
      </div>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center">
      <h3 className="text-black font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function Testimonial({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="mt-16 text-center">
      <blockquote className="text-2xl font-semibold italic text-gray-900">
        "{quote}"
      </blockquote>
      <p className="mt-4 text-gray-600">- {author}</p>
    </div>
  )
}

function PaymentMethods() {
  const methods = ['stripe', 'paypal', 'apple-pay', 'google-pay']
  return (
    <div className="mt-16 text-center">
      <h2 className="text-2xl text-black font-semibold mb-4">Integrated with Your Favorite Payment Methods</h2>
      <div className="flex justify-center space-x-8">
        {methods.map(method => (
          <img key={method} src={`/${method}.svg`} alt={method} className="h-12" />
        ))}
      </div>
    </div>
  )
}
