"use client";

import { ReactNode } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout — used for public-facing pages (home, about, services, contact).
 * Includes the site-wide navbar at the top and footer at the bottom.
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
