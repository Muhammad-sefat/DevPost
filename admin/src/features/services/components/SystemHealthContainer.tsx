"use client"

import * as React from "react"
import { MOCK_CRON_LOGS } from "../data/mock-health"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"

export function SystemHealthContainer() {
  const logs = MOCK_CRON_LOGS

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      <TopBar title="System Health" subtitle="Monitor n8n nightly triggers, generation pipeline runs, and server failures" />

      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto font-body">
        {/* Current status summary card */}
        <Card className="bg-bg-surface border-border p-5 rounded-xl shadow-lg">
          <CardContent className="p-0 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/10 text-success rounded-full border border-success/20">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">System Operational</h4>
                <p className="text-xs text-text-secondary mt-0.5">Last pipeline trigger resolved successfully 12 hours ago.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-bg-elevated px-3 py-1.5 rounded border border-border">
                <span className="text-text-secondary">Webhook Port: </span>
                <span className="text-brand font-semibold">4000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nightly runs list */}
        <Card className="bg-bg-surface border-border p-2 rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-text-primary">Cron Trigger Runs History</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Passive execution logs for daily post drafts generation.</CardDescription>
          </CardHeader>
          <CardContent className="p-2 space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 bg-bg-elevated/30 border border-border rounded-xl space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    {log.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-danger" />
                    )}
                    <span className="text-xs font-bold text-text-primary">{log.triggerTime} (UTC)</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono">
                    <span className="text-text-secondary">Processed: {log.usersProcessed} users</span>
                    <span className="text-text-secondary">Duration: {log.durationMs}ms</span>
                    <Badge variant={log.status === "success" ? "success" : "destructive"} className="text-[9px] font-mono rounded font-semibold py-0.5 px-2 uppercase">
                      {log.status}
                    </Badge>
                  </div>
                </div>

                {log.errorDetails && (
                  <div className="p-3 bg-danger/5 border border-danger/20 rounded-lg flex items-start gap-2 text-danger">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <p className="text-[10px] font-mono leading-relaxed">{log.errorDetails}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
