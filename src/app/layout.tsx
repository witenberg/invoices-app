import React from 'react'
import '@/app/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <div className="min-h-screen flex flex-col"> */}
          {/* <Navbar />
          <main className="flex-grow"> */}
            {children}
          {/* </main>
          <Footer /> */}
        {/* </div> */}
      </body>
    </html>
  )
}


