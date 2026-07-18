"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function SignUpForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated success redirect to email verification screen
    router.push("/verify-email")
  }

  return (
    <Card className="w-full max-w-md bg-bg-surface border-border p-2">
      <CardHeader className="text-center space-y-1">
        <span className="font-display font-bold text-2xl text-brand tracking-tight">DevPost</span>
        <CardTitle className="text-xl font-bold tracking-tight text-text-primary">Create your account</CardTitle>
        <CardDescription className="text-xs text-text-secondary">Start turning your code into content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Full name</label>
            <Input
              type="text"
              placeholder="Raihan Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg focus:border-brand"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Email address</label>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg focus:border-brand"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg pr-10 focus:border-brand"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Confirm password</label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg focus:border-brand"
              required
            />
          </div>

          <p className="text-[10px] text-text-muted leading-relaxed">
            By signing up you agree to our{" "}
            <span className="text-text-secondary hover:underline cursor-pointer">Terms</span> and{" "}
            <span className="text-text-secondary hover:underline cursor-pointer">Privacy Policy</span>.
          </p>

          <Button type="submit" className="w-full bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-10 rounded-lg mt-2">
            Create account
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative px-3 bg-bg-surface text-[10px] uppercase font-mono text-text-muted">or</span>
        </div>

        <Button
          onClick={() => router.push("/verify-email")}
          variant="outline"
          className="w-full bg-bg-elevated border-border text-text-primary hover:bg-bg-input hover:text-text-primary text-xs font-semibold h-10 rounded-lg flex items-center justify-center gap-2"
        >
          <Github className="h-4 w-4" />
          <span>Sign up with GitHub</span>
        </Button>

        <p className="text-center text-xs text-text-secondary pt-2">
          Already have an account?{" "}
          <Link href="/signin" className="text-brand font-semibold hover:underline">
            Sign in &rarr;
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
