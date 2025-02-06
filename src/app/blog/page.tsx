import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hero } from '@/components/Hero'
import { blogPosts, BlogPost } from '@/config/siteConfig'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="min-h-screen bg-white">
          <Hero
            title="Latest Updates & Resources"
            description="Insights and guides to help you manage your business better"
          />

          <div className="container mx-auto px-6 py-20">
            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Post key={post.title} {...post} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Post({ title, excerpt, author, date, category, image }: BlogPost) {
  return (
    <article className="border border-gray-200 rounded-lg overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-[#2E75B6] font-medium">{category}</span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">{date}</span>
        </div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">By {author}</span>
          <Button variant="outline" asChild>
            <Link href="#">Read More</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

