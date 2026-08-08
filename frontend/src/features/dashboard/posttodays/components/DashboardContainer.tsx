"use client"

import * as React from "react"
import { ActivitySummary } from "./ActivitySummary"
import { ActivityPulse } from "./ActivityPulse"
import { PostIdeaCard } from "./PostIdeaCard"
import { MonthlyOverview } from "./MonthlyOverview"
import { PostEditorModal } from "./PostEditorModal"
import { useTodayActivity, useTodaySuggestions } from "../hooks"

export function DashboardContainer() {
  const { activity, loading } = useTodayActivity()
  const { suggestions, loading: suggestionsLoading, refetch: refetchSuggestions } = useTodaySuggestions()

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      {/* Scrollable Layout Container */}
      <div className="flex-1 p-6 md:p-8 space-y-8 max-w-6xl w-full mx-auto">
        {/* Row 1: Activity summary */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase font-mono tracking-widest text-text-muted">Activity Summary</h2>
          <ActivitySummary activity={activity} loading={loading} />
        </section>

        {/* Row 2: SVG pulse line chart */}
        <section className="space-y-3">
          <h2 className="text-xs uppercase font-mono tracking-widest text-text-muted">Coding Velocity</h2>
          <ActivityPulse activity={activity} loading={loading} />
        </section>

        {/* Row 3: Suggestions 2x2 grid */}
        <section className="space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-xs uppercase font-mono tracking-widest text-text-muted">Your post ideas</h2>
              <p className="text-[11px] text-text-secondary mt-0.5">Pick one to open the editor and customize</p>
            </div>
            {suggestions.length > 0 && (
              <button
                onClick={() => refetchSuggestions(true)}
                disabled={suggestionsLoading}
                className="text-[10px] font-semibold text-brand hover:text-brand-hover bg-brand/5 border border-brand/20 rounded px-2.5 py-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestionsLoading ? "Regenerating..." : "🔄 Regenerate Ideas"}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {suggestionsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-bg-surface border border-border p-5 rounded-xl shadow-lg animate-pulse h-40 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-4 w-16 bg-bg-elevated rounded" />
                    <div className="space-y-1.5">
                      <div className="h-3 w-full bg-bg-elevated rounded" />
                      <div className="h-3 w-[90%] bg-bg-elevated rounded" />
                      <div className="h-3 w-[70%] bg-bg-elevated rounded" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="h-4 w-24 bg-bg-elevated rounded" />
                  </div>
                </div>
              ))
            ) : suggestions.length === 0 ? (
              <div className="col-span-full border border-dashed border-border rounded-xl p-8 bg-bg-surface/50 text-center space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">No post suggestions ready yet</h4>
                  <p className="text-xs text-text-secondary mt-1">
                    Connect GitHub or WakaTime and push your first commits today to generate ideas.
                  </p>
                </div>
                <button
                  onClick={() => refetchSuggestions(true)}
                  className="bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors border-0"
                >
                  Generate Suggestion Drafts 🚀
                </button>
              </div>
            ) : (
              suggestions.map((suggestion) => (
                <PostIdeaCard
                  key={suggestion.id}
                  id={suggestion.id}
                  text={suggestion.content}
                  tags={[suggestion.title]}
                />
              ))
            )}
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
