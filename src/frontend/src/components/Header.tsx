import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Flame, LogIn, LogOut, User } from "lucide-react";

interface HeaderProps {
  selectedCoach?: string | null;
}

export function Header({ selectedCoach }: HeaderProps) {
  const { identity, login, clear: logout, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoading = loginStatus === "logging-in";

  const shortPrincipal = identity
    ? `${identity.getPrincipal().toString().slice(0, 6)}...${identity.getPrincipal().toString().slice(-4)}`
    : "Guest";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 md:flex">
          <div className="h-2 w-2 animate-pulse rounded-full bg-chart-3" />
          <span className="text-xs text-muted-foreground">
            Coach:{" "}
            <span className="text-chart-3 font-medium">
              {selectedCoach
                ? selectedCoach.charAt(0).toUpperCase() + selectedCoach.slice(1)
                : "None selected"}
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-chart-4/30 bg-chart-4/10 px-3 py-1.5">
          <Flame className="h-4 w-4 text-chart-4" />
          <span className="text-sm font-semibold text-chart-4">12</span>
          <span className="text-xs text-muted-foreground">day streak</span>
        </div>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
                data-ocid="header.profile_button"
              >
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                    {shortPrincipal.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-panel">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {shortPrincipal.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {shortPrincipal}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Internet Identity
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                data-ocid="header.logout_button"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => login()}
            disabled={isLoading}
            className="gap-2"
            data-ocid="header.login_button"
          >
            <LogIn className="h-4 w-4" />
            {isLoading ? "Connecting..." : "Sign In"}
          </Button>
        )}
      </div>
    </header>
  );
}
