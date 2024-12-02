import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'

export default function Features() {
  const features = [
    {
      title: "Professional Invoicing",
      description: "Create and send professional invoices in seconds",
      items: [
        "Customizable invoice templates",
        "Automatic invoice numbering",
        "Add your company logo",
        "Multiple currency support",
        "Tax calculation and management",
        "Payment terms and due dates",
      ]
    },
    {
      title: "Subscription Management",
      description: "Manage recurring payments and subscriptions effortlessly",
      items: [
        "Automated recurring invoices",
        "Flexible billing cycles",
        "Usage-based billing",
        "Subscription analytics",
        "Customer portal access",
        "Payment reminder automation",
      ]
    },
    {
      title: "Payment Processing",
      description: "Get paid faster with integrated payment solutions",
      items: [
        "Multiple payment gateways",
        "Automatic payment reconciliation",
        "Credit card processing",
        "PayPal integration",
        "Bank transfer support",
        "Payment tracking",
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#2E75B6] text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center mb-6">
            Features that streamline your billing
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Everything you need to manage invoices, subscriptions, and get paid faster
          </p>
          <div className="flex justify-center gap-4 mt-10">
            <Button className="bg-white text-[#2E75B6] hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              View Demo
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature) => (
            <div key={feature.title} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
              <ul className="space-y-3">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#2E75B6] mt-1" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
