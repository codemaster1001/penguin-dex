import "@/styles/globals.css"
import { ReactNode } from "react"
import { Metadata } from "next"
import { cookies, headers } from "next/headers"
import Script from "next/script"

import { siteConfig } from "@/config/site"
import { inter } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import Header from "@/components/header"
import TailwindIndicator from "@/components/tailwind-indicator"
import ThemeProvider from "@/components/theme-provider"
import WalletAdapter from "@/components/wallet-adapter"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: ReactNode
  params: any
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const data = await headers().get("country")

  params.country = data

  return (
    <html lang="en">
      <head>
        <Script src="https://terminal.jup.ag/main-v1.js" data-preload />
      </head>
      <body className={cn("relative", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WalletAdapter>
            <Header />
            <div className="overflow-hidden bg-background">{children}</div>
          </WalletAdapter>
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}
