import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/use-auth"
import { TradesProvider } from "@/hooks/use-trades"
import { LanguageProvider } from "@/hooks/use-language"
import { Chatbot } from "@/components/chatbot/Chatbot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BinaryTrade - Advanced Trading Platform",
  description: "Professional binary options trading platform with real-time data and advanced features",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <TradesProvider>
              {children}
              <Chatbot />
            </TradesProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
