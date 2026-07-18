"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { Sparkles, Terminal, Code, Cpu, ChevronRight, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingContainer() {
  const router = useRouter()
  const heroRef = React.useRef<HTMLDivElement>(null)
  const stepsRef = React.useRef<HTMLDivElement>(null)
  const featuresRef = React.useRef<HTMLDivElement>(null)
  const showcaseRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // 1. Welcome hero stagger animations
    const ctx = gsap.context(() => {
      gsap.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.4, ease: "power2.out" })
      gsap.from(".hero-line", { y: 30, opacity: 0, stagger: 0.12, duration: 0.6, ease: "power3.out", delay: 0.15 })
      gsap.from(".hero-subtext", { y: 20, opacity: 0, duration: 0.5, ease: "power2.out", delay: 0.45 })
      gsap.from(".hero-cta", { y: 20, opacity: 0, stagger: 0.1, duration: 0.4, ease: "power2.out", delay: 0.6 })
      gsap.from(".step-card", {
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 0.5,
        ease: "power2.out"
      })
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
        scale: 0.95,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out"
      })
      gsap.from(".showcase-anim", {
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: "top 80%",
        },
        x: -30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out"
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-bg-base text-text-primary overflow-x-hidden flex flex-col font-body pb-16">
      {/* Radial Glow Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-brand/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Nav */}
      <header className="h-16 flex items-center justify-between px-6 md:px-12 border-b border-border bg-bg-surface/30 backdrop-blur-md sticky top-0 z-30">
        <Link href="/" className="font-display font-bold text-xl text-brand tracking-tight">
          DevPost
        </Link>
        <Link href="/signin">
          <Button variant="ghost" className="text-text-secondary hover:text-text-primary hover:bg-bg-elevated text-xs font-semibold px-4 py-2">
            Sign in
          </Button>
        </Link>
      </header>

      {/* Section 1: Hero */}
      <section ref={heroRef} className="px-6 md:px-12 py-20 md:py-28 flex flex-col items-center text-center relative z-10 max-w-4xl mx-auto">
        <span className="hero-eyebrow font-mono text-[10px] md:text-xs font-bold tracking-widest text-brand uppercase mb-4 bg-brand/10 px-3 py-1 rounded-full border border-brand/20">
          FOR DEVELOPERS WHO SHIP DAILY
        </span>
        <h1 className="font-display font-extrabold text-3xl md:text-5xl text-text-primary leading-[1.15] mb-6">
          <span className="hero-line block">Turn your commits</span>
          <span className="hero-line block text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-hover">into LinkedIn content.</span>
        </h1>
        <p className="hero-subtext text-sm md:text-base text-text-secondary max-w-xl mb-8 leading-relaxed">
          DevPost watches your GitHub activity and WakaTime coding times every day, then writes personal post ideas based on what you actually built. No writer&apos;s block, just shipping.
        </p>
        <div className="hero-cta flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
          <Link href="/signup">
            <Button className="bg-brand text-text-inverse hover:bg-brand-hover font-semibold px-6 py-3 h-auto text-sm rounded-lg flex items-center gap-2 group w-full sm:w-auto justify-center">
              <span>Get started free</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/signin" className="text-xs text-text-secondary hover:text-text-primary font-semibold hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </section>

      {/* Section 2: How It Works */}
      <section ref={stepsRef} className="px-6 md:px-12 py-16 border-t border-border bg-bg-surface/20 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-bold text-xl md:text-2xl text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="step-card bg-bg-surface border border-border p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-24 w-24 bg-brand/5 blur-xl rounded-full" />
              <div className="h-10 w-10 bg-bg-elevated border border-border flex items-center justify-center rounded-lg text-brand font-mono font-bold text-sm mb-4">01</div>
              <h3 className="font-display font-semibold text-base mb-2">Connect your stack</h3>
              <p className="text-xs text-text-secondary leading-relaxed">Securely link your GitHub account and WakaTime API key with a few clicks. DevPost runs passively in the background.</p>
            </div>
            <div className="step-card bg-bg-surface border border-border p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-24 w-24 bg-brand/5 blur-xl rounded-full" />
              <div className="h-10 w-10 bg-bg-elevated border border-border flex items-center justify-center rounded-lg text-brand font-mono font-bold text-sm mb-4">02</div>
              <h3 className="font-display font-semibold text-base mb-2">Passive Evening Generation</h3>
              <p className="text-xs text-text-secondary leading-relaxed">Every evening, DevPost gathers your commits and language breakdowns, generating 4-5 personalized LinkedIn posts using Claude AI.</p>
            </div>
            <div className="step-card bg-bg-surface border border-border p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-24 w-24 bg-brand/5 blur-xl rounded-full" />
              <div className="h-10 w-10 bg-bg-elevated border border-border flex items-center justify-center rounded-lg text-brand font-mono font-bold text-sm mb-4">03</div>
              <h3 className="font-display font-semibold text-base mb-2">Select, Edit & Post</h3>
              <p className="text-xs text-text-secondary leading-relaxed">Open your dashboard, select an idea, customize the phrasing in the editor with our AI refinement assistant, and post it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Features */}
      <section ref={featuresRef} className="px-6 md:px-12 py-20 relative z-10 max-w-5xl mx-auto w-full">
        <h2 className="font-display font-bold text-xl md:text-2xl text-center mb-12">Packed with developer-first features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="feature-card bg-bg-surface border border-border p-6 rounded-xl flex gap-4">
            <div className="p-2.5 bg-bg-elevated border border-border rounded-lg text-brand h-fit"><Code className="h-5 w-5" /></div>
            <div>
              <h3 className="font-display font-semibold text-base mb-2">GitHub Activity Monitor</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-body">Tracks repository additions, pulls, branch merges, and commit descriptions to draft precise technical stories.</p>
            </div>
          </div>
          <div className="feature-card bg-bg-surface border border-border p-6 rounded-xl flex gap-4">
            <div className="p-2.5 bg-bg-elevated border border-border rounded-lg text-brand h-fit"><Terminal className="h-5 w-5" /></div>
            <div>
              <h3 className="font-display font-semibold text-base mb-2">WakaTime Metrics</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-body">Extracts exact coding metrics, lang percentages, and project timelines to back up your achievements with real stats.</p>
            </div>
          </div>
          <div className="feature-card bg-bg-surface border border-border p-6 rounded-xl flex gap-4">
            <div className="p-2.5 bg-bg-elevated border border-border rounded-lg text-brand h-fit"><Sparkles className="h-5 w-5" /></div>
            <div>
              <h3 className="font-display font-semibold text-base mb-2">AI Contextual Refinement</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-body">Tweak and re-format drafts directly inside the post editor modal using simple text instructions (e.g. &quot;make it casual&quot;).</p>
            </div>
          </div>
          <div className="feature-card bg-bg-surface border border-border p-6 rounded-xl flex gap-4">
            <div className="p-2.5 bg-bg-elevated border border-border rounded-lg text-brand h-fit"><Cpu className="h-5 w-5" /></div>
            <div>
              <h3 className="font-display font-semibold text-base mb-2">RAG Memory Integration</h3>
              <p className="text-xs text-text-secondary leading-relaxed font-body">Vectorized posting memory (powered by Qdrant) ensures the AI learns your style and avoids repeating subjects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Showcase (Dynamic mockup visualization) */}
      <section ref={showcaseRef} className="px-6 md:px-12 py-16 border-t border-border bg-bg-surface/10 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-4">
            <h2 className="showcase-anim font-display font-bold text-xl md:text-2xl">See your workflow translate into stories</h2>
            <p className="showcase-anim text-xs md:text-sm text-text-secondary leading-relaxed">
              Instead of spending an hour deciding what to write, DevPost summarizes raw metrics into structured, developer-focused social posts ready for copy and share.
            </p>
            <div className="showcase-anim flex items-center gap-2 text-xs font-mono text-brand font-semibold">
              <Github className="h-4 w-4" />
              <span>Synced and analyzed in UTC daily</span>
            </div>
          </div>
          <div className="w-full md:w-1/2 showcase-anim bg-bg-surface border border-border rounded-xl p-5 shadow-2xl relative overflow-hidden font-mono text-[11px] leading-relaxed">
            <div className="flex items-center gap-2 border-b border-border pb-3 mb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-danger/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/50" />
              <span className="text-[10px] text-text-muted ml-2">devpost-activity.log</span>
            </div>
            <div className="space-y-2 text-text-secondary">
              <p><span className="text-brand">$</span> devpost --analyze today</p>
              <p className="text-text-muted">&gt; Analyzing commits: 4 commits pushed to main</p>
              <p className="text-text-muted">&gt; WakaTime: 402 minutes in VSCode (TypeScript, SQL)</p>
              <p className="text-success">&gt; Claude AI: Suggested draft generated successfully!</p>
              <div className="p-3 bg-bg-elevated border border-border rounded text-text-primary text-[10px] mt-4 font-body leading-normal relative">
                <span className="absolute top-2 right-2 text-[9px] bg-brand/20 text-brand px-1.5 py-0.5 rounded font-mono font-semibold">DRAFT</span>
                <p className="font-semibold text-text-primary font-display mb-1">TypeScript Debugging</p>
                <p className="text-text-secondary">Spent 4 hours debugging a generic type constraint issue today. Relearned why strict conditional types are critical...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Footer */}
      <footer className="mt-auto px-6 py-10 border-t border-border text-center text-xs text-text-muted">
        <p className="mb-2">Built by a developer, for developers.</p>
        <p className="font-mono text-[10px]">&copy; 2026 DevPost. All rights reserved.</p>
      </footer>
    </div>
  )
}
