import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { LayoutClient } from "./layout.client"
import { Providers } from "./providers"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "agents-ui-kit",
  description:
    "Advanced UI components for building AI agent interfaces. Build sophisticated agent experiences, autonomous assistants, and multi-agent systems with beautiful, customizable components.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDev = process.env.NODE_ENV === "development"

  return (
    <html lang="en" suppressHydrationWarning>
      {!isDev ? (
        <Script
          async
          src="https://analytics.umami.is/script.js"
          data-website-id="d96e0c36-2259-4f49-86cf-0f8d296645bd"
        />
      ) : null}
      <body
        className={`${inter.className} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>
          <LayoutClient>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  )
}
