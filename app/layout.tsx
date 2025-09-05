import type React from "react"
import type { Metadata } from "next"
import {
  Playfair_Display,
  Source_Sans_3,
  JetBrains_Mono,
} from "next/font/google"
import "./globals.css"

// Fonts
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
  weight: ["400", "700"],
})

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans-3",
  weight: ["400", "600"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

// Metadata
export const metadata: Metadata = {
  title: "Disaster Intelligence System",
  description: "Hyper-Localized Disaster Intelligence & Environmental Monitor",
  generator: "v0.app",
}

// Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${sourceSans3.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  )
}
