"use client"

import * as React from "react"
import Link from "next/link"
import { MOCK_CUSTOMERS } from "../data/mock-customers"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Github, Clock, Calendar, CheckCircle2 } from "lucide-react"

interface UserDetailContainerProps {
  id: string
}

export function UserDetailContainer({ id }: UserDetailContainerProps) {
  const customer = MOCK_CUSTOMERS.find((c) => c.id === id) || MOCK_CUSTOMERS[0]

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      <TopBar title={`Developer Profile — ${customer.name}`} subtitle={`Review stats and logs for ${customer.email}`} />

      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl w-full mx-auto font-body">
        {/* Back Link */}
        <div className="flex">
          <Link href="/customers" className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1.5 font-semibold transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Users List</span>
          </Link>
        </div>

        {/* User Card */}
        <Card className="bg-bg-surface border-border p-2">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <CardTitle className="text-lg font-bold text-text-primary">{customer.name}</CardTitle>
                <Badge variant={customer.status === "active" ? "success" : "destructive"} className="text-[9px] uppercase font-mono tracking-wider font-semibold py-0.5 px-2 rounded">
                  {customer.status}
                </Badge>
              </div>
              <CardDescription className="text-xs text-text-secondary mt-1">Joined on {customer.joinedDate} &middot; ID: {customer.id}</CardDescription>
            </div>
            <span className="text-xs font-mono bg-bg-elevated border border-border px-3 py-1.5 rounded-lg text-text-secondary">
              Role: {customer.role}
            </span>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-bg-elevated/30 border border-border p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand/10 text-brand rounded-lg">
                    <Github className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-text-primary">GitHub Sync</h5>
                    <p className="text-[10px] text-text-secondary mt-0.5">
                      {customer.connections.github ? "Connected &middot; Active" : "Disconnected"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-bg-elevated/30 border border-border p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand/10 text-brand rounded-lg">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-text-primary">WakaTime Sync</h5>
                    <p className="text-[10px] text-text-secondary mt-0.5">
                      {customer.connections.wakatime ? "Connected &middot; Active" : "Disconnected"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generated Content History Mock Grid */}
        <Card className="bg-bg-surface border-border p-2 rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-text-primary">Recent Generated LinkedIn Drafts</CardTitle>
            <CardDescription className="text-xs text-text-secondary">passive review logs of AI posts drafted for this developer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border border-border rounded-xl p-4 bg-bg-elevated/20 relative">
              <span className="absolute top-4 right-4 text-[9px] font-mono bg-success/15 border border-success/30 text-success px-2 py-0.5 rounded uppercase font-semibold">Posted</span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-secondary mb-2">
                <Calendar className="h-3 w-3" />
                <span>June 10, 2025</span>
              </div>
              <p className="text-xs text-text-primary leading-relaxed max-w-xl">
                &ldquo;Shipped my first REST API with Express and PostgreSQL today. Coming from a frontend background, thinking in schemas and tables feels completely different...&rdquo;
              </p>
            </div>

            <div className="border border-border rounded-xl p-4 bg-bg-elevated/20 relative">
              <span className="absolute top-4 right-4 text-[9px] font-mono bg-warning/15 border border-warning/30 text-warning px-2 py-0.5 rounded uppercase font-semibold">Skipped</span>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-secondary mb-2">
                <Calendar className="h-3 w-3" />
                <span>June 08, 2025</span>
              </div>
              <p className="text-xs text-text-primary leading-relaxed max-w-xl">
                &ldquo;Spent the morning on system design. Here is my layout strategy for building scaling APIs without adding complex load balancers...&rdquo;
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
