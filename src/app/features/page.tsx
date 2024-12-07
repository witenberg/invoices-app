import { Button } from "@/components/ui/button"
import { Check } from 'lucide-react'
import { Hero } from '@/components/Hero'
import { features, Feature } from '@/config/siteConfig'

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      <Hero
        title="Features that streamline your billing"
        description="Everything you need to manage invoices, subscriptions, and get paid faster"
      >
        <Button className="bg-white text-[#2E75B6] hover:bg-gray-100">
          Start Free Trial
        </Button>
        <Button variant="outline" className="border-white text-white hover:bg-white/10">
          View Demo
        </Button>
      </Hero>

      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature) => (
            <FeatureSection key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </div>
  )
}

function FeatureSection({ title, description, items }: Feature) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-[#2E75B6] mt-1" />
            <span className="text-gray-600">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

