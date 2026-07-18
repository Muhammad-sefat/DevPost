"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <Card className="w-full max-w-md bg-bg-surface border-border p-2">
      <CardHeader className="space-y-1 relative">
        <Link href="/signin" className="absolute left-6 top-6 text-text-secondary hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="text-center pt-4">
          <span className="font-display font-bold text-2xl text-brand tracking-tight">DevPost</span>
          <CardTitle className="text-xl font-bold tracking-tight text-text-primary mt-2">Reset your password</CardTitle>
          {!submitted && (
            <CardDescription className="text-xs text-text-secondary">
              Enter your email and we&apos;ll send you a reset link.
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3.5">
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
            <Button type="submit" className="w-full bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-10 rounded-lg mt-2">
              Send reset link
            </Button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-text-primary">Check your email</h4>
              <p className="text-xs text-text-secondary leading-relaxed px-4">
                We sent a reset link to <span className="font-semibold text-text-primary">{email}</span>. Please click the link to configure your password.
              </p>
            </div>
            <div className="pt-2 text-xs">
              <span className="text-text-muted">Didn&apos;t receive it? </span>
              <button onClick={() => setSubmitted(false)} className="text-brand font-semibold hover:underline bg-transparent border-0 p-0 cursor-pointer">
                Resend link
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
