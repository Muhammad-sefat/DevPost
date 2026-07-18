"use client"

import * as React from "react"
import gsap from "gsap"
import { MOCK_ACTIVITY } from "../data/mock-activity"
import { Card, CardContent } from "@/components/ui/card"

export function ActivityPulse() {
  const pulse = MOCK_ACTIVITY.hourlyPulse
  const pathRef = React.useRef<SVGPathElement>(null)
  
  // Dimensions
  const width = 800
  const height = 120

  // Find scale bounds
  const maxVal = Math.max(...pulse, 5) // ensure at least 5 for height spacing
  const points = pulse.map((val, idx) => {
    const x = (idx / (pulse.length - 1)) * width
    // y starts from top, so invert: 0 coding minutes is at bottom (height), max is at top (10px padding)
    const y = height - 10 - (val / maxVal) * (height - 20)
    return { x, y }
  })

  // Create path strings
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  React.useEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current
      const length = path.getTotalLength()
      
      // Set starting properties
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      
      // Animate draw in
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.out"
      })
    }
  }, [])

  return (
    <Card className="bg-bg-surface border-border p-5 rounded-xl shadow-lg">
      <CardContent className="p-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-[10px] uppercase font-mono tracking-wider text-text-muted">Hourly Activity Pulse</p>
            <p className="text-[11px] text-text-secondary mt-0.5">Coding intensity over 24 hours</p>
          </div>
          <span className="text-[10px] font-mono text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded">
            GSAP Animated
          </span>
        </div>

        {/* SVG Container */}
        <div className="relative w-full aspect-[800/120] md:h-[120px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Grid Lines */}
            <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="0" y1={height} x2={width} y2={height} stroke="var(--color-border)" strokeWidth="0.5" />

            {/* Filled Area */}
            <path
              d={areaPath}
              fill="url(#pulseGlow)"
              className="opacity-40"
            />

            {/* Path Stroke */}
            <path
              ref={pathRef}
              d={linePath}
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Hot Dots (Activity Peaks) */}
            {points.map((p, idx) => {
              if (pulse[idx] > 10) {
                return (
                  <g key={idx} className="animate-pulse">
                    <circle cx={p.x} cy={p.y} r="5" fill="var(--color-brand)" className="opacity-40" />
                    <circle cx={p.x} cy={p.y} r="2.5" fill="var(--color-text-primary)" />
                  </g>
                )
              }
              return null
            })}

            {/* Gradients */}
            <defs>
              <linearGradient id="pulseGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0.0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between text-[9px] font-mono text-text-muted mt-2 px-1">
          <span>12 AM</span>
          <span>4 AM</span>
          <span>8 AM</span>
          <span>12 PM</span>
          <span>4 PM</span>
          <span>8 PM</span>
          <span>11 PM</span>
        </div>
      </CardContent>
    </Card>
  )
}
