import type { Metadata } from "next"
import { Providers } from "@/store/provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Super admin dashboard for managing the platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
