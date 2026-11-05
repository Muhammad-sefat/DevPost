import React, { Suspense } from "react"
import { LandingContainer } from "@/features/landing"

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-base" />}>
      <LandingContainer />
    </Suspense>
  )
}
