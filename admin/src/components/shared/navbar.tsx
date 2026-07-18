"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";

export function Navbar() {
  // TODO: replace with real auth data once auth is wired up
  const userName = "Super Admin";
  const initials = "MS";

  return (
    <header className="flex h-12 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold text-primary">
          Welcome back, {userName}
        </h2>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-6 w-6 rounded-full">
            <Avatar>
              <AvatarFallback className="bg-primary text-secondary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-42">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="flex flex-col">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
