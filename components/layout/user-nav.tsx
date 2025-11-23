"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Settings, LifeBuoy, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthActions } from "@/lib/hooks/use-auth-actions";

interface UserNavProps {
  user: User;
}

export function UserNav({ user }: UserNavProps) {
  const { logout } = useAuthActions();
  
  // Ambil data user dengan fallback yang aman
  const initials = user?.email?.charAt(0).toUpperCase() || "U";
  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.email;
  const username = user?.user_metadata?.username || "user";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-slate-100 dark:ring-slate-800 hover:ring-indigo-500 transition-all">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* Header Info User */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none truncate">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Group 1: Akun */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={`/u/${username}`}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Group 2: Bantuan */}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/help">
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        {/* Logout */}
        <DropdownMenuItem 
          className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}