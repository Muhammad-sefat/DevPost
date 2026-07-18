import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReduxProvider } from "@/store/provider";
import { QueryProvider } from "@/lib/query-client";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Your App",
    template: "%s | Your App",
  },
  description: "A modern full-stack application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ReduxProvider>
          <QueryProvider>{children}</QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
