"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export function VerifyEmailView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyEmail, user } = useAuth()
  
  const [email, setEmail] = React.useState("")
  const [otpDigits, setOtpDigits] = React.useState<string[]>(Array(6).fill(""))
  const [countdown, setCountdown] = React.useState(60)
  const [canResend, setCanResend] = React.useState(false)
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

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

  const handleOtpChange = (index: number, value: string) => {
    // Only take character or digit
    const cleaned = value.trim()
    if (!cleaned) {
      const newOtp = [...otpDigits]
      newOtp[index] = ""
      setOtpDigits(newOtp)
      return
    }

    const char = cleaned.substring(cleaned.length - 1)
    const newOtp = [...otpDigits]
    newOtp[index] = char
    setOtpDigits(newOtp)

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()
    if (!pastedData) return

    const digits = pastedData.slice(0, 6).split("")
    const newOtp = Array(6).fill("")
    digits.forEach((digit, i) => {
      newOtp[i] = digit
    })
    setOtpDigits(newOtp)

    const nextIndex = Math.min(digits.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (!email) {
      toast.error("Please enter your email address")
      setIsLoading(false)
      return
    }

    const fullOtp = otpDigits.join("")
    if (fullOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP code")
      setIsLoading(false)
      return
    }

    try {
      const res = await verifyEmail({ email: email.trim(), otp: fullOtp.trim() })
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingVerificationEmail")
      }

      const resUser = res?.data?.user || res?.data || user
      if (resUser?.role === "ADMIN" || resUser?.role === "SUPER_ADMIN") {
        router.push("/dashboard/admin-panel")
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      // Handled in useAuth hook
    } finally {
      setIsLoading(false)
    }
  }

  const [isResending, setIsResending] = React.useState(false)

  const handleResend = () => {
    setIsResending(true)
    setTimeout(() => {
      setIsResending(false)
      setCountdown(60)
      setCanResend(false)
      toast.info("Resent OTP verification code to your email.")
    }, 600)
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
            Enter the 6-digit OTP code sent to your email inbox.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleVerify} className="space-y-5">
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

          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-secondary">Verification Code (6 Digits)</label>
            <div className="flex items-center justify-between gap-2">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isLoading}
                  className="w-11 h-12 text-center text-lg font-mono font-bold rounded-lg bg-bg-input border border-border focus:border-brand focus:ring-1 focus:ring-brand text-text-primary outline-none transition-colors disabled:opacity-50"
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-10 rounded-lg flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Verify Email & Continue</span>
              </>
            )}
          </Button>
        </form>

        <div className="space-y-3 pt-2 text-center">
          <Button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isLoading || isResending}
            variant="outline"
            className="w-full bg-bg-elevated border-border text-text-primary hover:bg-bg-input disabled:opacity-50 text-xs font-semibold h-10 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {isResending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Resending code...</span>
              </>
            ) : canResend ? (
              "Resend verification code"
            ) : (
              `Resend in ${countdown}s`
            )}
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
