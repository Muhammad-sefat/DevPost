"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Enter your password"
          className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          required
        />
      </div>

      <button type="submit" className="w-full bg-primary text-secondary rounded py-2 font-medium hover:opacity-90">
        Sign in
      </button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
