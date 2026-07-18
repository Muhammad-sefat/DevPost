"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function SetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const getStrength = () => {
    if (!password) return 0
    let points = 0
    if (password.length >= 8) points++
    if (/[A-Z]/.test(password)) points++
    if (/[0-9]/.test(password)) points++
    if (/[^A-Za-z0-9]/.test(password)) points++
    return points
  }

  const strength = getStrength()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      router.push("/signin")
    }, 2000)
  }

  return (
    <Card className="w-full max-w-md bg-bg-surface border-border p-2">
      <CardHeader className="text-center space-y-1">
        <span className="font-display font-bold text-2xl text-brand tracking-tight">DevPost</span>
        <CardTitle className="text-xl font-bold tracking-tight text-text-primary mt-2">Set a new password</CardTitle>
        <CardDescription className="text-xs text-text-secondary">
          Choose a strong password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">New password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg focus:border-brand"
                required
              />
            </div>

            {/* Password strength indicator */}
            {password && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-text-secondary font-mono">
                  <span>Password strength</span>
                  <span>{strength === 1 && "Weak"}</span>
                  <span>{strength === 2 && "Fair"}</span>
                  <span>{strength === 3 && "Good"}</span>
                  <span>{strength === 4 && "Strong"}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1">
                  <div className={cn("h-full rounded-full transition-all duration-300", strength >= 1 ? "bg-danger" : "bg-bg-input")} />
                  <div className={cn("h-full rounded-full transition-all duration-300", strength >= 2 ? "bg-warning" : "bg-bg-input")} />
                  <div className={cn("h-full rounded-full transition-all duration-300", strength >= 3 ? "bg-brand" : "bg-bg-input")} />
                  <div className={cn("h-full rounded-full transition-all duration-300", strength >= 4 ? "bg-success" : "bg-bg-input")} />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Confirm password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg focus:border-brand"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-10 rounded-lg mt-2">
              Set password
            </Button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-success animate-bounce" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-text-primary">Password updated</h4>
              <p className="text-xs text-text-secondary">
                Redirecting you to sign in page...
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
