import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Mono, Roboto_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

// Font tanımlamaları
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
})

const robotoMono = Roboto_Mono({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "İletişim Başkanlığı - Kriz İletişim Monitörü",
  description: "İletişim ile ilgili haberlerin gerçek zamanlı izlenmesi",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${inter.variable} ${spaceMono.variable} ${robotoMono.variable}`}>
      <head>
      <script src="http://localhost:8097"></script>
        <link
          rel="icon"
          href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/I%CC%87letis%CC%A7im_Bas%CC%A7kanl%C4%B1g%CC%86%C4%B1_logo.svg-5rucsMbOD8GaKOL5W63IQsv7vLTo5V.png"
          type="image/png"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'