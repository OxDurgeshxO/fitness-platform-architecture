import { GlassCard } from "@/components/GlassCard";
import { NeonBadge } from "@/components/NeonBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  Brain,
  Dumbbell,
  Flame,
  MapPin,
  MessageSquare,
  Salad,
  ScanEye,
  TrendingUp,
  Wifi,
} from "lucide-react";
import { motion } from "motion/react";

const modules = [
  {
    title: "AI Gym Trainer",
    description: "Real-time pose analysis & rep counting",
    icon: Dumbbell,
    to: "/trainer",
    stats: "248 reps today",
    badge: "cyan" as const,
    glow: "cyan" as const,
  },
  {
    title: "AI Dietician",
    description: "Personalized nutrition & meal plans",
    icon: Salad,
    to: "/dietician",
    stats: "1,840 kcal tracked",
    badge: "green" as const,
    glow: "green" as const,
  },
  {
    title: "Smart Gym",
    description: "IoT equipment monitoring",
    icon: Wifi,
    to: "/iot",
    stats: "3 devices active",
    badge: "purple" as const,
    glow: "purple" as const,
  },
  {
    title: "Habit Tracker",
    description: "Behavioral analytics & predictions",
    icon: TrendingUp,
    to: "/habits",
    stats: "87% consistency",
    badge: "cyan" as const,
    glow: "cyan" as const,
  },
  {
    title: "Gym Buddy",
    description: "AI companion & motivation",
    icon: MessageSquare,
    to: "/buddy",
    stats: "5 chats today",
    badge: "purple" as const,
    glow: "purple" as const,
  },
  {
    title: "Pose Analyzer",
    description: "Motion efficiency & scores",
    icon: ScanEye,
    to: "/analyzer",
    stats: "Performance: 92",
    badge: "green" as const,
    glow: "green" as const,
  },
  {
    title: "Recommender",
    description: "Gym & program suggestions",
    icon: MapPin,
    to: "/recommender",
    stats: "2 nearby gyms",
    badge: "orange" as const,
    glow: "none" as const,
  },
];

const quickStats = [
  {
    label: "Workouts",
    value: "24",
    change: "+3 this week",
    icon: Activity,
    color: "text-primary",
  },
  {
    label: "Calories Burned",
    value: "8,420",
    change: "+12% vs last week",
    icon: Flame,
    color: "text-chart-4",
  },
  {
    label: "Avg Score",
    value: "88.4",
    change: "+2.1 improvement",
    icon: Brain,
    color: "text-chart-2",
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Dashboard"
        subtitle="Your AI-powered fitness command center"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <GlassCard className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50">
                  <Icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="mt-0.5 text-xs text-chart-3">{stat.change}</p>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <div>
        <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
          Modules
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
              >
                <Link to={mod.to} className="block">
                  <GlassCard glow={mod.glow} className="group cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-smooth">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <NeonBadge color={mod.badge}>Active</NeonBadge>
                    </div>
                    <h4 className="mt-3 font-display text-base font-semibold text-foreground">
                      {mod.title}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {mod.description}
                    </p>
                    <p className="mt-3 text-xs font-mono text-primary">
                      {mod.stats}
                    </p>
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
