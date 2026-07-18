"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <span>Portal Site</span>
        </Link>

        {/* Links */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-primary">Home</Link>
          <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-primary">About</Link>
          <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-primary">Contact</Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login" className="bg-primary text-secondary px-4 py-2 rounded hover:opacity-90">Log in</Link>
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t bg-white md:hidden">
          <nav className="flex flex-col gap-3 px-4 pb-4 pt-2">
            <Link href="/" className="text-sm font-medium text-gray-700">Home</Link>
            <Link href="/about" className="text-sm font-medium text-gray-700">About</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700">Contact</Link>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
