"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="text-lg font-bold text-primary">
            Portal Site
          </Link>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Portal Site. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
