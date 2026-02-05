import React, { Suspense } from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import ClientFooter from './components/ClientFooter'
import { PHProvider } from './providers' // ✅ Correct Import
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'AmplifyAI - Stop Being Invisible to AI Search',
  description: '40% of searches happen on ChatGPT. Does your brand exist there?',
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
}

// 👇 THIS "export default" WAS MISSING OR BROKEN
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased bg-navy-dark text-white min-h-screen relative`}>
        
        {/* ✅ WRAP BODY CONTENT WITH PROVIDER */}
        <PHProvider>
          
          {/* GLOBAL BACKGROUND */}
          <div 
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-80"
            style={{ backgroundImage: "url('/images/bg.jpg')" }} 
          />
          <div className="fixed inset-0 z-0 bg-gradient-to-tr from-indigo-900/20 via-purple-900/10 to-black/40 pointer-events-none" />

          {/* GLOBAL NAVBAR */}
          <div className="relative z-50">
             <Navbar />
          </div>

          {/* DYNAMIC PAGE CONTENT */}
          <div className="relative z-10 pt-24"> 
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </div>

          {/* GLOBAL FOOTER */}
          <div className="relative z-10">
            <ClientFooter />
          </div>
          
          <Analytics />

        </PHProvider>
      </body>
    </html>
  )
}