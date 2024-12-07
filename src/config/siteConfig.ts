import { Check } from 'lucide-react'

export interface Feature {
  title: string
  description: string
  items: string[]
}

export const features: Feature[] = [
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

export interface Plan {
  name: string
  price: string
  description: string
  popular?: boolean
  features: string[]
}

export const plans: Plan[] = [
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

export interface BlogPost {
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  image: string
}

export const blogPosts: BlogPost[] = [
  {
    title: "How to streamline your invoicing process",
    excerpt: "Learn the best practices for efficient invoicing and get paid faster.",
    author: "Sarah Johnson",
    date: "May 28, 2024",
    category: "Guides",
    image: "/placeholder.svg?height=200&width=400"
  },
  {
    title: "The future of digital payments",
    excerpt: "Discover the latest trends in payment processing and what they mean for your business.",
    author: "Michael Chen",
    date: "May 25, 2024",
    category: "Industry News",
    image: "/placeholder.svg?height=200&width=400"
  },
  {
    title: "Managing subscription-based businesses",
    excerpt: "Tips and strategies for growing your subscription-based revenue.",
    author: "Emily Williams",
    date: "May 22, 2024",
    category: "Tips & Tricks",
    image: "/placeholder.svg?height=200&width=400"
  }
]
