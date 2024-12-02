import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "9",
      description: "Perfect for freelancers and small businesses",
      features: [
        "Up to 10 invoices per month",
        "Basic invoice templates",
        "Email support",
        "Payment tracking",
        "Basic reporting",
        "Single user"
      ]
    },
    {
      name: "Professional",
      price: "29",
      description: "Ideal for growing businesses",
      popular: true,
      features: [
        "Unlimited invoices",
        "Custom invoice templates",
        "Priority support",
        "Advanced reporting",
        "Multiple users",
        "API access",
        "Custom branding",
        "Subscription billing"
      ]
    },
    {
      name: "Enterprise",
      price: "99",
      description: "For large organizations with complex needs",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integration support",
        "Advanced API features",
        "SLA guarantee",
        "Unlimited everything",
        "Custom contract terms"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#2E75B6] text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Choose the plan that best fits your business needs
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg p-8 ${
                plan.popular
                  ? "border-2 border-[#2E75B6] shadow-lg"
                  : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <span className="text-[#2E75B6] font-medium text-sm">Most Popular</span>
              )}
              <h2 className="text-black text-2xl font-bold mt-2">{plan.name}</h2>
              <div className="mt-4 flex items-baseline">
                <span className="text-black text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-600 ml-1">/month</span>
              </div>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              <Button
                className={`w-full mt-6 ${
                  plan.popular
                    ? "bg-[#2E75B6] hover:bg-[#235d92]"
                    : "bg-gray-800 hover:bg-gray-900"
                }`}
              >
                Get Started
              </Button>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#2E75B6] mt-1" />
                    <span className="text-gray-600">{feature}</span>
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

