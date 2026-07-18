"use client"

import * as React from "react"
import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function VerifyEmailView() {
  const [countdown, setCountdown] = React.useState(60)
  const [canResend, setCanResend] = React.useState(false)

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleResend = () => {
    setCountdown(60)
    setCanResend(false)
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
            We sent a verification link to your inbox.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <p className="text-xs text-text-secondary leading-relaxed px-4">
          Click the link sent to <span className="font-semibold text-text-primary">raihan@example.com</span> to verify your identity and activate your DevPost dashboard.
        </p>

        <div className="space-y-3 pt-2">
          <Button
            onClick={handleResend}
            disabled={!canResend}
            variant="outline"
            className="w-full bg-bg-elevated border-border text-text-primary hover:bg-bg-input disabled:opacity-50 text-xs font-semibold h-10 rounded-lg"
          >
            {canResend ? "Resend verification email" : `Resend in ${countdown}s`}
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
