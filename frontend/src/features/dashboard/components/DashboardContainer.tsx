"use client"

import * as React from "react"
import { ActivitySummary } from "@/features/activity/components/ActivitySummary"
import { ActivityPulse } from "@/features/activity/components/ActivityPulse"
import { PostIdeaCard } from "@/features/posts/components/PostIdeaCard"
import { MonthlyOverview } from "@/features/posts/components/MonthlyOverview"
import { PostEditorModal } from "@/features/posts/components/PostEditorModal"
import { MOCK_POST_IDEAS } from "@/features/posts/data/mock-posts"
import { TopBar } from "@/components/layout/TopBar"

export function DashboardContainer() {
  const posts = MOCK_POST_IDEAS

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      {/* Top Header */}
      <TopBar title="Today's Posts" subtitle="Monday, June 14 · Based on your activity" />

      {/* Scrollable Layout Container */}
      <div className="flex-1 p-6 md:p-8 space-y-8 max-w-6xl w-full mx-auto">
        {/* Row 1: Activity summary */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase font-mono tracking-widest text-text-muted">Activity Summary</h2>
          <ActivitySummary />
        </section>

        {/* Row 2: SVG pulse line chart */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase font-mono tracking-widest text-text-muted">Coding Velocity</h2>
          <ActivityPulse />
        </section>

        {/* Row 3: Suggestions 2x2 grid */}
        <section className="space-y-3">
          <div>
            <h2 className="text-xs uppercase font-mono tracking-widest text-text-muted">Your post ideas</h2>
            <p className="text-[11px] text-text-secondary mt-0.5">Pick one to open the editor and customize</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {posts.map((post) => (
              <PostIdeaCard
                key={post.id}
                id={post.id}
                text={post.text}
                tags={post.tags}
              />
            ))}
          </div>
        </section>

        {/* Row 4: Streak boxes */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase font-mono tracking-widest text-text-muted">Posting Consistency</h2>
          <MonthlyOverview />
        </section>
      </div>

      {/* Editor Modal Overlay */}
      <PostEditorModal />
    </div>
  )
}
