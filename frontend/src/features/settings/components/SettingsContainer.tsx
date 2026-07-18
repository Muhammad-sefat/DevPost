"use client"

import * as React from "react"
import { useToast } from "@/components/ui/toast"
import { TopBar } from "@/components/layout/TopBar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Github, Clock, Bell, Trash2, ShieldAlert } from "lucide-react"

export function SettingsContainer() {
  const { toast } = useToast()
  
  // Profile state
  const [name, setName] = React.useState("Raihan Ahmed")
  
  // Connection state
  const [githubConnected, setGithubConnected] = React.useState(true)
  const [wakatimeConnected, setWakatimeConnected] = React.useState(false)
  const [wakaApiKey, setWakaApiKey] = React.useState("")
  
  // Notifications state
  const [notifyEmail, setNotifyEmail] = React.useState("raihan@example.com")
  const [notifyTime, setNotifyTime] = React.useState("20:00")
  
  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [confirmType, setConfirmType] = React.useState<"history" | "account" | null>(null)

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: "Profile updated!", description: "Your changes have been saved successfully.", type: "success" })
  }

  const handleNotificationSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast({ title: "Notifications saved!", description: `We'll email you daily at ${notifyTime}.`, type: "success" })
  }

  const triggerConfirm = (type: "history" | "account") => {
    setConfirmType(type)
    setConfirmOpen(true)
  }

  const handleConfirmAction = () => {
    setConfirmOpen(false)
    if (confirmType === "history") {
      toast({ title: "History deleted!", description: "All post history has been permanently deleted.", type: "success" })
    } else if (confirmType === "account") {
      toast({ title: "Account deleted!", description: "Your account and data have been queued for deletion.", type: "error" })
    }
    setConfirmType(null)
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      <TopBar title="Settings" subtitle="Manage your profile, integrations, and preferences" />

      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl w-full mx-auto font-body">
        {/* Profile Card */}
        <Card className="bg-bg-surface border-border p-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-text-primary">Profile Details</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Update your public representation details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="flex items-center gap-4 border-b border-border pb-4 mb-4">
                <Avatar className="h-12 w-12 bg-brand/20 border border-brand/30">
                  <AvatarFallback className="text-base font-bold text-brand font-mono">RA</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-xs font-semibold text-text-primary">Profile Picture</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">Mock avatar generated from email</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Full Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Email Address (Read-only)</label>
                  <Input
                    type="email"
                    value="raihan@example.com"
                    className="bg-bg-input/50 border-border text-text-muted text-xs h-10 rounded-lg cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              <Button type="submit" className="bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-10 px-5 rounded-lg mt-2">
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Connections & Alerts */}
        <Card className="bg-bg-surface border-border p-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-text-primary">Connections & Alerts</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Integrate third-party metrics and schedule emails.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Github Connection row */}
            <div className="flex justify-between items-center border-b border-border pb-4">
              <div className="flex gap-3">
                <div className="p-2.5 bg-bg-elevated border border-border rounded-lg text-brand h-fit"><Github className="h-4 w-4" /></div>
                <div>
                  <h4 className="text-xs font-semibold text-text-primary">GitHub Integration</h4>
                  {githubConnected ? (
                    <p className="text-[10px] text-success mt-0.5">Connected &middot; @raihanahmed</p>
                  ) : (
                    <p className="text-[10px] text-text-muted mt-0.5">Not connected</p>
                  )}
                </div>
              </div>
              <Button
                onClick={() => setGithubConnected(!githubConnected)}
                variant="outline"
                className="bg-bg-elevated border-border text-text-primary hover:bg-bg-input text-xs font-semibold h-9 px-4 rounded-lg"
              >
                {githubConnected ? "Disconnect" : "Connect GitHub"}
              </Button>
            </div>

            {/* Wakatime Connection row */}
            <div className="border-b border-border pb-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <div className="p-2.5 bg-bg-elevated border border-border rounded-lg text-brand h-fit"><Clock className="h-4 w-4" /></div>
                  <div>
                    <h4 className="text-xs font-semibold text-text-primary">WakaTime Sync</h4>
                    {wakatimeConnected ? (
                      <p className="text-[10px] text-success mt-0.5">Connected &middot; API Sync Active</p>
                    ) : (
                      <p className="text-[10px] text-text-muted mt-0.5">Not connected</p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => setWakatimeConnected(!wakatimeConnected)}
                  variant="outline"
                  className="bg-bg-elevated border-border text-text-primary hover:bg-bg-input text-xs font-semibold h-9 px-4 rounded-lg"
                >
                  {wakatimeConnected ? "Disconnect" : "Connect WakaTime"}
                </Button>
              </div>

              {!wakatimeConnected && (
                <div className="bg-bg-input/30 p-3 rounded-lg border border-border flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-semibold text-text-secondary">WakaTime Secret API Key</label>
                    <Input
                      type="password"
                      placeholder="wsp_..."
                      value={wakaApiKey}
                      onChange={(e) => setWakaApiKey(e.target.value)}
                      className="bg-bg-input border-border text-text-primary text-xs h-9 rounded-lg"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (wakaApiKey) {
                        setWakatimeConnected(true)
                        toast({ title: "WakaTime Connected!", description: "Metrics sync has been configured.", type: "success" })
                      }
                    }}
                    className="bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-9 px-4 rounded-lg shrink-0"
                  >
                    Save API Key
                  </Button>
                </div>
              )}
            </div>

            {/* Email Notifications row */}
            <form onSubmit={handleNotificationSave} className="space-y-4">
              <div className="flex gap-3">
                <div className="p-2.5 bg-bg-elevated border border-border rounded-lg text-brand h-fit"><Bell className="h-4 w-4" /></div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-text-primary">Alert Schedule</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">We will email you as soon as your daily post suggestions are ready.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Notification Email</label>
                  <Input
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Delivery Time (UTC)</label>
                  <Input
                    type="time"
                    value={notifyTime}
                    onChange={(e) => setNotifyTime(e.target.value)}
                    className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg font-mono"
                  />
                </div>
              </div>

              <Button type="submit" className="bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-10 px-4 rounded-lg">
                Save notification settings
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-danger/30 bg-danger/5 p-2 rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-danger">Danger Zone</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Destructive actions that cannot be reversed.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-text-primary">Erase post history</h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">This will delete all previously posted drafts and skipping metrics.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => triggerConfirm("history")}
                variant="outline"
                className="border-danger/50 text-danger hover:bg-danger/10 text-xs font-semibold h-9 rounded-lg"
              >
                Delete all post history
              </Button>
              <Button
                onClick={() => triggerConfirm("account")}
                className="bg-danger text-text-inverse hover:bg-danger-muted text-xs font-semibold h-9 rounded-lg"
              >
                Delete account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm bg-bg-surface border-border p-5 rounded-xl shadow-2xl">
          <DialogHeader className="text-center space-y-3">
            <div className="flex justify-center text-danger">
              <ShieldAlert className="h-10 w-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-base font-bold text-text-primary">Are you absolutely sure?</DialogTitle>
              <DialogDescription className="text-xs text-text-secondary leading-relaxed">
                This action is irreversible. All selected data will be deleted permanently.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex items-center gap-3 pt-4 border-t border-border mt-4">
            <Button
              onClick={() => setConfirmOpen(false)}
              variant="outline"
              className="flex-1 bg-bg-elevated border-border text-text-primary hover:bg-bg-input text-xs font-semibold h-10 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              className="flex-1 bg-danger text-text-inverse hover:bg-danger-muted text-xs font-semibold h-10 rounded-lg"
            >
              Yes, delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
