import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import "../styles/agents.css"
import Script from "next/script"
import { LayoutClient } from "./layout.client"
import { Providers } from "./providers"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://agents-ui.github.io/agents-kit/"),
  title: "Agents Kit",
  description:
    "Compact React components for generative UI, agent thinking, tools, approvals, and interactive results. Copy the source and connect your own models.",
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
        className={`${inter.className} ${inter.variable} ${jetBrainsMono.variable} font-sans antialiased`}
      >
        <Providers>
          <LayoutClient>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  )
}
