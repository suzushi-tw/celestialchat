import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from "@/components/navbar";
import toast, { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CelestialChat',
  description: 'Ai powered websearch for blazing fast search results ...',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster />
        <Navbar />

        {children}
      </body>
    </html>
  )
}
