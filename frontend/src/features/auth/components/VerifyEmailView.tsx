"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export function VerifyEmailView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyEmail, isLoading } = useAuth()
  
  const [email, setEmail] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [countdown, setCountdown] = React.useState(60)
  const [canResend, setCanResend] = React.useState(false)

  React.useEffect(() => {
    const paramEmail = searchParams.get("email")
    const storedEmail = typeof window !== "undefined" ? localStorage.getItem("pendingVerificationEmail") : null
    if (paramEmail) {
      setEmail(paramEmail)
    } else if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [searchParams])

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email address")
      return
    }
    if (!otp || otp.trim().length === 0) {
      toast.error("Please enter the verification code sent to your email")
      return
    }

    try {
      await verifyEmail({ email: email.trim(), otp: otp.trim() })
      toast.success("Email verified! You can now sign in.")
      router.push("/signin")
    } catch (err) {
      // Handled in useAuth hook
    }
  }

  const handleResend = () => {
    setCountdown(60)
    setCanResend(false)
    toast.info("Resent OTP verification code to your email.")
  }

  return (
    <Card className="w-full max-w-md bg-bg-surface border-border p-2">
      <CardHeader className="text-center space-y-4 pt-6">
        <div className="flex justify-center">
          <div className="p-4 bg-brand/10 text-brand rounded-full border border-brand/20">
            <Mail className="h-10 w-10" />
          </div>
        </div>
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight text-text-primary">Verify your email</CardTitle>
          <CardDescription className="text-xs text-text-secondary">
            Enter the 6-digit OTP code sent to your inbox.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Email address</label>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg focus:border-brand"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-secondary">Verification Code (OTP)</label>
            <Input
              type="text"
              placeholder="Enter OTP code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg text-center font-mono tracking-widest text-sm focus:border-brand"
              required
              maxLength={6}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-10 rounded-lg flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isLoading ? "Verifying..." : "Verify Email & Continue"}</span>
          </Button>
        </form>

        <div className="space-y-3 pt-2 text-center">
          <Button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isLoading}
            variant="outline"
            className="w-full bg-bg-elevated border-border text-text-primary hover:bg-bg-input disabled:opacity-50 text-xs font-semibold h-10 rounded-lg"
          >
            {canResend ? "Resend verification code" : `Resend in ${countdown}s`}
          </Button>

          <div className="text-xs">
            <Link href="/signup" className="text-text-muted hover:text-text-primary font-medium transition-colors">
              Wrong email? Go back
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
