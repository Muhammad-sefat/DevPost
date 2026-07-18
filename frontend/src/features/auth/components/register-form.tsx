"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">Name</label>
        <input
          placeholder="John Doe"
          type="text"
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Email</label>
        <input
          placeholder="you@example.com"
          type="email"
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          placeholder="Create password"
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      <button type="submit" className="w-full bg-primary text-secondary rounded py-2 font-medium hover:opacity-90">
        Sign up
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
