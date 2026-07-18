"use client"

import * as React from "react"
import { useToast } from "@/components/ui/toast"
import { TopBar } from "@/components/layout/TopBar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SystemSettingsContainer() {
  const { toast } = useToast()
  
  // Settings state
  const [webhookSecret, setWebhookSecret] = React.useState("devpost_n8n_secure_secret_hash")
  const [defaultCron, setDefaultCron] = React.useState("0 20 * * *")
  const [tokensLimit, setTokensLimit] = React.useState("50000")

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: "Settings Saved!", description: "Admin configurations updated successfully.", type: "success" })
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      <TopBar title="System Settings" subtitle="Configure platform variables, API bounds, and secret keys" />

      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-3xl w-full mx-auto font-body">
        <Card className="bg-bg-surface border-border p-2 rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-text-primary">System Parameters</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Manage integrations hooks and limits.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Internal Webhook Secret (n8n header key)</label>
                <Input
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Default Cron Execution Pattern</label>
                <Input
                  type="text"
                  value={defaultCron}
                  onChange={(e) => setDefaultCron(e.target.value)}
                  className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Maximum Tokens Limit Per Generation</label>
                <Input
                  type="number"
                  value={tokensLimit}
                  onChange={(e) => setTokensLimit(e.target.value)}
                  className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg font-mono"
                />
              </div>

              <Button type="submit" className="bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-10 px-5 rounded-lg mt-2">
                Save Configurations
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
