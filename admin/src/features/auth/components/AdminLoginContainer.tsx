"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function AdminLoginContainer() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated redirect to dashboard overview
    router.push("/")
  }

  return (
    <Card className="w-full max-w-md bg-bg-surface border-border p-2">
      <CardHeader className="text-center space-y-1">
        <div className="flex justify-center items-center gap-1.5 mb-2">
          <span className="font-display font-bold text-2xl text-text-primary tracking-tight">DevPost</span>
          <span className="font-display font-bold text-xs bg-brand/10 border border-brand/20 text-brand px-1.5 py-0.5 rounded">Admin</span>
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-text-primary">Admin Sign In</CardTitle>
        <CardDescription className="text-xs text-text-secondary">Platform monitor portal</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Email address</label>
            <Input
              type="email"
              placeholder="admin@devpost.app"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary animate-fade-in"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-10 rounded-lg mt-2">
            Sign In to Panel
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
