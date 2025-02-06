import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import { Hero } from '@/components/Hero'
import { plans, Plan } from '@/config/siteConfig'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="min-h-screen bg-white">
          <Hero
            title="Simple, transparent pricing"
            description="Choose the plan that best fits your business needs"
          />

          <div className="container mx-auto px-6 py-20">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <PricingPlan key={plan.name} {...plan} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div >
  )
}

function PricingPlan({ name, price, description, popular, features }: Plan) {
  return (
    <div
      className={`rounded-lg p-8 ${popular
        ? "border-2 border-[#2E75B6] shadow-lg"
        : "border border-gray-200"
        }`}
    >
      {popular && (
        <span className="text-[#2E75B6] font-medium text-sm">Most Popular</span>
      )}
      <h2 className="text-black text-2xl font-bold mt-2">{name}</h2>
      <div className="mt-4 flex items-baseline">
        <span className="text-black text-4xl font-bold">${price}</span>
        <span className="text-gray-600 ml-1">/month</span>
      </div>
      <p className="text-gray-600 mt-2">{description}</p>
      <Button
        className={`w-full mt-6 ${popular
          ? "bg-[#2E75B6] hover:bg-[#235d92]"
          : "bg-gray-800 hover:bg-gray-900"
          }`}
      >
        Get Started
      </Button>
      <ul className="mt-6 space-y-4">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-[#2E75B6] mt-1" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

