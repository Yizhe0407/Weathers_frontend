import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className} style={{ userSelect: 'none' }}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}