"use client"

import * as React from "react"
import { MOCK_USAGE_LOGS } from "../data/mock-analytics"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Cpu, DollarSign, Activity } from "lucide-react"

export function UsageAnalyticsContainer() {
  const logs = MOCK_USAGE_LOGS

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      <TopBar title="API Usage & Cost Tracker" subtitle="Monitor token consumption and pricing calculations for LLM generation" />

      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto font-body">
        {/* Core metrics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-bg-surface border-border p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-brand/10 text-brand rounded-lg">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider font-mono">Monthly Tokens</p>
              <h3 className="text-xl font-bold text-text-primary mt-0.5">1,406,800</h3>
            </div>
          </Card>
          
          <Card className="bg-bg-surface border-border p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-success/10 text-success rounded-lg">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider font-mono">Estimated Cost</p>
              <h3 className="text-xl font-bold text-text-primary mt-0.5">$42.50</h3>
            </div>
          </Card>

          <Card className="bg-bg-surface border-border p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-warning/10 text-warning rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-text-secondary uppercase tracking-wider font-mono">Avg Cost / User</p>
              <h3 className="text-xl font-bold text-text-primary mt-0.5">$0.34</h3>
            </div>
          </Card>
        </div>

        {/* Detailed logs table */}
        <Card className="bg-bg-surface border-border p-2 rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-text-primary">Daily Generation Usage Logs</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Review precise API token expenditures on a per-generation basis.</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <Table>
              <TableHeader className="bg-bg-elevated/40 border-b border-border">
                <TableRow>
                  <TableHead className="text-xs text-text-muted font-semibold h-11 px-4">Date</TableHead>
                  <TableHead className="text-xs text-text-muted font-semibold h-11">Developer</TableHead>
                  <TableHead className="text-xs text-text-muted font-semibold h-11">AI Model</TableHead>
                  <TableHead className="text-xs text-text-muted font-semibold h-11">Tokens Used</TableHead>
                  <TableHead className="text-xs text-text-muted font-semibold h-11 text-right px-4">Cost (USD)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/40 font-mono text-[11px]">
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-bg-elevated/20 transition-colors">
                    <TableCell className="px-4 py-3.5 text-text-primary">{log.date}</TableCell>
                    <TableCell className="font-body font-medium text-text-secondary">{log.user}</TableCell>
                    <TableCell className="text-text-muted">{log.provider}</TableCell>
                    <TableCell className="text-text-primary">{log.tokensUsed.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-brand font-bold px-4">${log.costUsd.toFixed(3)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
