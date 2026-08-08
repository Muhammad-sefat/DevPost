"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Github,
  Clock,
  Bell,
  ShieldAlert,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useSettings } from "../hooks/use-settings";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const totalMinutes = i * 30;
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  const value = `${hours24.toString().padStart(2, "0")}:${minutes}`;
  const ampm = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const label = `${hours12.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  return { value, label };
});

export function SettingsContainer() {
  const { user, logout } = useAuth();
  const {
    connections,
    loading: connectionsLoading,
    actionLoading,
    connectGithub,
    disconnectGithub,
    connectWakatime,
    disconnectWakatime,
  } = useSettings();

  // Profile state
  const [name, setName] = React.useState(user?.name || "Demo User");

  // Connection state
  const [wakaApiKey, setWakaApiKey] = React.useState("");
  const [showWakaForm, setShowWakaForm] = React.useState(false);

  // Notifications state
  const [notifyEmail, setNotifyEmail] = React.useState(
    user?.email || "example@example.com",
  );
  const [notifyTime, setNotifyTime] = React.useState("20:00");

  // Confirm dialog state
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [confirmType, setConfirmType] = React.useState<
    "history" | "account" | null
  >(null);

  React.useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.email) setNotifyEmail(user.email);
  }, [user]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated! Changes saved successfully.");
  };

  const handleNotificationSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      `Notifications saved! Daily emails scheduled at ${notifyTime}.`,
    );
  };

  const triggerConfirm = (type: "history" | "account") => {
    setConfirmType(type);
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    setConfirmOpen(false);
    if (confirmType === "history") {
      toast.success("All post history has been permanently deleted.");
    } else if (confirmType === "account") {
      toast.error("Account deleted successfully.");
      await logout();
    }
    setConfirmType(null);
  };

  const githubConnected = !!connections?.github?.connected;
  const wakatimeConnected = !!connections?.wakatime?.connected;
  const githubUsername = connections?.github?.username;

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-4xl w-full mx-auto font-body">
        {/* Profile Card */}
        <Card className="bg-bg-surface border-border p-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-text-primary">
              Profile Details
            </CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              Update your public representation details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="flex items-center gap-4 border-b border-border pb-4 mb-4">
                <Avatar className="h-12 w-12 bg-brand/20 border border-brand/30">
                  {user?.avatarUrl && (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  )}
                  <AvatarFallback className="text-base font-bold text-brand font-mono">
                    {user?.name ? (
                      user.name.slice(0, 2).toUpperCase()
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-xs font-semibold text-text-primary">
                    {user?.name || name}
                  </h4>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {user?.role || "USER"} &middot; {user?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Email Address (Read-only)
                  </label>
                  <Input
                    type="email"
                    value={user?.email || "user@example.com"}
                    className="bg-bg-input/50 border-border text-text-muted text-xs h-10 rounded-lg cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  className="bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-10 px-5 rounded-lg"
                >
                  Save changes
                </Button>
                <Button
                  type="button"
                  onClick={logout}
                  variant="outline"
                  className="bg-bg-elevated border-border text-danger hover:bg-danger/10 text-xs font-semibold h-10 px-4 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Connections & Alerts */}
        <Card className="bg-bg-surface border-border p-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-text-primary">
              Connections & Alerts
            </CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              Integrate third-party metrics and schedule emails.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Github Connection row */}
            <div className="flex justify-between items-center border-b border-border pb-4">
              <div className="flex gap-3">
                <div className="p-2.5 bg-bg-elevated border border-border rounded-lg text-brand h-fit">
                  <Github className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-text-primary">
                    GitHub Integration
                  </h4>
                  {connectionsLoading ? (
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-text-muted">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Checking status...</span>
                    </div>
                  ) : githubConnected ? (
                    <p className="text-[10px] text-success mt-0.5">
                      Connected &middot; Active Sync{" "}
                      {githubUsername ? `(@${githubUsername})` : ""}
                    </p>
                  ) : (
                    <p className="text-[10px] text-text-muted mt-0.5">
                      Not connected
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={githubConnected ? disconnectGithub : connectGithub}
                variant="outline"
                disabled={
                  connectionsLoading ||
                  actionLoading.githubConnect ||
                  actionLoading.githubDisconnect
                }
                className="bg-bg-elevated border-border text-text-primary hover:bg-bg-input text-xs font-semibold h-9 px-4 rounded-lg flex items-center gap-2 cursor-pointer"
              >
                {(actionLoading.githubConnect ||
                  actionLoading.githubDisconnect) && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-text-secondary" />
                )}
                <span>
                  {githubConnected
                    ? actionLoading.githubDisconnect
                      ? "Disconnecting..."
                      : "Disconnect"
                    : actionLoading.githubConnect
                      ? "Connecting..."
                      : "Connect GitHub"}
                </span>
              </Button>
            </div>

            {/* Wakatime Connection row */}
            <div className="border-b border-border pb-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <div className="p-2.5 bg-bg-elevated border border-border rounded-lg text-brand h-fit">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-text-primary">
                      WakaTime Sync
                    </h4>
                    {connectionsLoading ? (
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-text-muted">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Checking status...</span>
                      </div>
                    ) : wakatimeConnected ? (
                      <p className="text-[10px] text-success mt-0.5">
                        Connected &middot; API Sync Active
                      </p>
                    ) : (
                      <p className="text-[10px] text-text-muted mt-0.5">
                        Not connected
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={
                    wakatimeConnected
                      ? disconnectWakatime
                      : () => setShowWakaForm(!showWakaForm)
                  }
                  variant="outline"
                  disabled={
                    connectionsLoading || actionLoading.wakatimeDisconnect
                  }
                  className="bg-bg-elevated border-border text-text-primary hover:bg-bg-input text-xs font-semibold h-9 px-4 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  {actionLoading.wakatimeDisconnect && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-text-secondary" />
                  )}
                  <span>
                    {wakatimeConnected
                      ? actionLoading.wakatimeDisconnect
                        ? "Disconnecting..."
                        : "Disconnect"
                      : showWakaForm
                        ? "Cancel"
                        : "Connect WakaTime"}
                  </span>
                </Button>
              </div>

              {!wakatimeConnected && showWakaForm && (
                <div className="bg-bg-input/30 p-3 rounded-lg border border-border flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-semibold text-text-secondary">
                      WakaTime Secret API Key
                    </label>
                    <Input
                      type="password"
                      placeholder="wsp_..."
                      value={wakaApiKey}
                      disabled={actionLoading.wakatimeConnect}
                      onChange={(e) => setWakaApiKey(e.target.value)}
                      className="bg-bg-input border-border text-text-primary text-xs h-9 rounded-lg"
                    />
                  </div>
                  <Button
                    onClick={async () => {
                      if (wakaApiKey) {
                        const success = await connectWakatime(wakaApiKey);
                        if (success) {
                          setWakaApiKey("");
                          setShowWakaForm(false);
                        }
                      } else {
                        toast.error("Please enter a WakaTime API key");
                      }
                    }}
                    disabled={actionLoading.wakatimeConnect || !wakaApiKey}
                    className="bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-9 px-4 rounded-lg shrink-0 flex items-center gap-2 cursor-pointer"
                  >
                    {actionLoading.wakatimeConnect && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-text-inverse" />
                    )}
                    <span>
                      {actionLoading.wakatimeConnect
                        ? "Saving..."
                        : "Save API Key"}
                    </span>
                  </Button>
                </div>
              )}
            </div>

            {/* Email Notifications row */}
            <form onSubmit={handleNotificationSave} className="space-y-4">
              <div className="flex gap-3">
                <div className="p-2.5 bg-bg-elevated border border-border rounded-lg text-brand h-fit">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-text-primary">
                    Alert Schedule
                  </h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">
                    We will email you as soon as your daily post suggestions are
                    ready.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Notification Email
                  </label>
                  <Input
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Delivery Time (UTC)
                  </label>
                  <Select value={notifyTime} onValueChange={setNotifyTime}>
                    <SelectTrigger className="bg-bg-input border-border text-text-primary text-xs h-10 rounded-lg font-mono w-full cursor-pointer">
                      <SelectValue placeholder="Select delivery time" />
                    </SelectTrigger>
                    <SelectContent className="bg-bg-surface border-border text-text-primary max-h-60 overflow-y-auto">
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="font-mono">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="bg-brand text-text-inverse hover:bg-brand-hover text-xs font-semibold h-10 px-4 rounded-lg cursor-pointer"
              >
                Save notification settings
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-danger/30 bg-danger/5 p-2 rounded-xl">
          <CardHeader>
            <CardTitle className="text-base font-bold text-danger">
              Danger Zone
            </CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              Destructive actions that cannot be reversed.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-text-primary">
                Erase post history
              </h4>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                This will delete all previously posted drafts and skipping
                metrics.
              </p>
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
              <DialogTitle className="text-base font-bold text-text-primary">
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription className="text-xs text-text-secondary leading-relaxed">
                This action is irreversible. All selected data will be deleted
                permanently.
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
  );
}
