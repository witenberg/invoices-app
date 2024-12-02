import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Blog() {
  const posts = [
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

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#2E75B6] text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center mb-6">
            Latest Updates & Resources
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Insights and guides to help you manage your business better
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.title} className="border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-[#2E75B6] font-medium">{post.category}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{post.date}</span>
                </div>
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">By {post.author}</span>
                  <Button variant="outline" asChild>
                    <Link href="#">Read More</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

