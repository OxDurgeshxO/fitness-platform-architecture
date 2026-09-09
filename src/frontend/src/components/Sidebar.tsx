import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  Brain,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Salad,
  ScanEye,
  TrendingUp,
  Users,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/trainer", label: "AI Gym Trainer", icon: Dumbbell },
  { to: "/dietician", label: "AI Dietician", icon: Salad },
  { to: "/iot", label: "Smart Gym", icon: Wifi },
  { to: "/habits", label: "Habit Tracker", icon: TrendingUp },
  { to: "/buddy", label: "Gym Buddy", icon: MessageSquare },
  { to: "/analyzer", label: "Pose Analyzer", icon: ScanEye },
  { to: "/recommender", label: "Recommender", icon: MapPin },
  { to: "/coaches", label: "Multi-Coach", icon: Users },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  selectedCoach?: string | null;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card/90 px-2 py-2 backdrop-blur-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-xs transition-smooth",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              data-ocid={`sidebar.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
            >
              <Icon className="h-5 w-5" />
              <span className="scale-90">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex h-screen flex-col border-r border-border bg-card/80 backdrop-blur-xl"
    >
      <div className="flex h-16 items-center gap-3 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
          <Flame className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-display text-lg font-bold tracking-tight text-foreground"
          >
            AI Gym
          </motion.span>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                active
                  ? "bg-primary/10 text-primary shadow-neon-cyan"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
              data-ocid={`sidebar.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-smooth hover:text-foreground"
        data-ocid="sidebar.toggle_button"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </motion.aside>
  );
}
