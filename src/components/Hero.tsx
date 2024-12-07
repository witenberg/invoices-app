import { ReactNode } from 'react'

interface HeroProps {
  title: string
  description: string
  children?: ReactNode
}

export function Hero({ title, description, children }: HeroProps) {
  return (
    <div className="bg-[#2E75B6] text-white py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-6">
          {title}
        </h1>
        <p className="text-xl text-center max-w-3xl mx-auto">
          {description}
        </p>
        {children && (
          <div className="flex justify-center gap-4 mt-10">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
