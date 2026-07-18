"use client"

import * as React from "react"
import Link from "next/link"
import { MOCK_CUSTOMERS, MockCustomer } from "../data/mock-customers"
import { useToast } from "@/components/ui/toast"
import { TopBar } from "@/components/layout/TopBar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Clock } from "lucide-react"

export function UserManagementContainer() {
  const { toast } = useToast()
  const [users, setUsers] = React.useState<MockCustomer[]>(MOCK_CUSTOMERS)

  const toggleSuspension = (id: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          const nextStatus = user.status === "active" ? "suspended" : "active"
          toast({
            title: `User ${nextStatus === "active" ? "Reactivated" : "Suspended"}!`,
            description: `Successfully modified user status to ${nextStatus}.`,
            type: nextStatus === "active" ? "success" : "warning",
          })
          return { ...user, status: nextStatus }
        }
        return user
      })
    )
  }

  const toggleRole = (id: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          const nextRole = user.role === "USER" ? "ADMIN" : "USER"
          toast({
            title: "Role updated!",
            description: `Modified role for ${user.name} to ${nextRole}.`,
            type: "success",
          })
          return { ...user, role: nextRole }
        }
        return user
      })
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen pb-20">
      <TopBar title="User Management" subtitle="Manage client accounts, adjust permissions, and suspend access" />

      <div className="flex-1 p-6 md:p-8 space-y-6 max-w-6xl w-full mx-auto font-body">
        <div className="bg-bg-surface border border-border rounded-xl overflow-hidden shadow-lg">
          <Table>
            <TableHeader className="bg-bg-elevated/40 border-b border-border">
              <TableRow>
                <TableHead className="text-xs text-text-muted font-semibold h-12 px-5">Developer Details</TableHead>
                <TableHead className="text-xs text-text-muted font-semibold h-12">Role</TableHead>
                <TableHead className="text-xs text-text-muted font-semibold h-12">Connections</TableHead>
                <TableHead className="text-xs text-text-muted font-semibold h-12">Status</TableHead>
                <TableHead className="text-xs text-text-muted font-semibold h-12 text-right px-5">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/40">
              {users.map((u) => (
                <TableRow key={u.id} className="hover:bg-bg-elevated/20 transition-colors">
                  <TableCell className="px-5 py-4">
                    <Link href={`/customers/${u.id}`} className="hover:underline font-semibold text-text-primary text-xs block">
                      {u.name}
                    </Link>
                    <span className="text-[10px] text-text-muted font-mono block mt-0.5">{u.email}</span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleRole(u.id)}
                      className="text-[10px] font-mono font-bold border border-border hover:border-brand px-2 py-1 rounded bg-bg-elevated text-text-secondary cursor-pointer"
                    >
                      {u.role}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`p-1 rounded ${u.connections.github ? "text-success bg-success/10 border border-success/20" : "text-text-muted bg-bg-input"}`} title="GitHub">
                        <Github className="h-3.5 w-3.5" />
                      </span>
                      <span className={`p-1 rounded ${u.connections.wakatime ? "text-success bg-success/10 border border-success/20" : "text-text-muted bg-bg-input"}`} title="WakaTime">
                        <Clock className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.status === "active" ? "success" : "destructive"} className="text-[9px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded">
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-5">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/customers/${u.id}`}>
                        <Button variant="outline" className="h-8 border-border hover:bg-bg-input text-[10px] font-semibold rounded-lg">
                          Details
                        </Button>
                      </Link>
                      <Button
                        onClick={() => toggleSuspension(u.id)}
                        variant="outline"
                        className={`h-8 text-[10px] font-semibold rounded-lg ${
                          u.status === "active"
                            ? "border-danger/30 text-danger hover:bg-danger/10"
                            : "border-success/30 text-success hover:bg-success/10"
                        }`}
                      >
                        {u.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
