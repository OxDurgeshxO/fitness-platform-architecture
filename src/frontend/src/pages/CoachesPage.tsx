import { GlassCard } from "@/components/GlassCard";
import { useCoach } from "@/components/Layout";
import { NeonBadge } from "@/components/NeonBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Award, Dumbbell, Heart, Salad, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface Coach {
  id: string;
  name: string;
  specialty: string;
  icon: typeof Dumbbell;
  color: "cyan" | "green" | "purple";
  desc: string;
  experience: string;
  activeUsers: string;
  stats: { label: string; value: string }[];
}

const coaches: Coach[] = [
  {
    id: "atlas",
    name: "Atlas",
    specialty: "Strength",
    icon: Dumbbell,
    color: "cyan",
    desc: "Elite powerlifting & hypertrophy specialist. Atlas designs progressive overload programs tailored to your biomechanics, maximizing strength gains while minimizing injury risk.",
    experience: "8+ Years",
    activeUsers: "12.4K",
    stats: [
      { label: "Avg. Strength Gain", value: "+34%" },
      { label: "Programs Designed", value: "2,847" },
    ],
  },
  {
    id: "nyx",
    name: "Nyx",
    specialty: "Diet",
    icon: Salad,
    color: "green",
    desc: "Precision nutritionist & macro architect. Nyx crafts adaptive meal plans that evolve with your training phase, body composition goals, and metabolic responses.",
    experience: "6+ Years",
    activeUsers: "18.2K",
    stats: [
      { label: "Meal Plans Created", value: "9,120" },
      { label: "Avg. Body Fat Drop", value: "-8.2%" },
    ],
  },
  {
    id: "phoenix",
    name: "Phoenix",
    specialty: "Rehabilitation",
    icon: Heart,
    color: "purple",
    desc: "Movement rehabilitation & mobility expert. Phoenix guides recovery from injury with evidence-based protocols, restoring full range of motion and functional strength.",
    experience: "10+ Years",
    activeUsers: "7.8K",
    stats: [
      { label: "Recovery Rate", value: "94%" },
      { label: "Protocols Built", value: "1,560" },
    ],
  },
];

function HolographicAvatar({
  coach,
  isSelected,
}: { coach: Coach; isSelected: boolean }) {
  const Icon = coach.icon;
  const colorMap = {
    cyan: "from-primary/30 to-primary/5 border-primary/40 shadow-neon-cyan",
    green: "from-chart-3/30 to-chart-3/5 border-chart-3/40 shadow-neon-green",
    purple: "from-accent/30 to-accent/5 border-accent/40 shadow-neon-purple",
  };
  const iconColorMap = {
    cyan: "text-primary",
    green: "text-chart-3",
    purple: "text-accent",
  };
  const glowColorMap = {
    cyan: "bg-primary/20",
    green: "bg-chart-3/20",
    purple: "bg-accent/20",
  };

  return (
    <div className="relative mx-auto h-32 w-32">
      {/* Outer rotating ring */}
      <div
        className={`absolute inset-0 rounded-full border-2 border-dashed border-${coach.color === "cyan" ? "primary" : coach.color === "green" ? "chart-3" : "accent"}/30 animate-spin`}
        style={{ animationDuration: "8s" }}
      />
      {/* Inner pulsing ring */}
      <div
        className={`absolute inset-2 rounded-full border border-${coach.color === "cyan" ? "primary" : coach.color === "green" ? "chart-3" : "accent"}/20`}
        style={{ animation: "pulse 3s ease-in-out infinite" }}
      />
      {/* Avatar core */}
      <div
        className={`absolute inset-4 flex items-center justify-center rounded-full bg-gradient-to-b ${colorMap[coach.color]} border backdrop-blur-sm transition-all duration-500 ${isSelected ? "scale-110" : "scale-100"}`}
      >
        <div
          className={`absolute inset-0 rounded-full ${glowColorMap[coach.color]} animate-pulse`}
        />
        <Icon
          className={`relative h-12 w-12 ${iconColorMap[coach.color]} drop-shadow-lg`}
        />
      </div>
      {/* Holographic scan line */}
      <div
        className="absolute inset-4 overflow-hidden rounded-full"
        style={{ pointerEvents: "none" }}
      >
        <div
          className={`h-full w-full bg-gradient-to-b from-transparent via-${coach.color === "cyan" ? "primary" : coach.color === "green" ? "chart-3" : "accent"}/10 to-transparent`}
          style={{
            animation: "scanLine 2.5s ease-in-out infinite",
            transform: "translateY(-100%)",
          }}
        />
      </div>
    </div>
  );
}

export function CoachesPage() {
  const { selectedCoach, setSelectedCoach } = useCoach();

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Multi-Coach Hub"
        subtitle="Select your AI coach specialization. Your chosen coach will personalize your entire fitness ecosystem."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {coaches.map((coach, index) => {
          const isSelected = selectedCoach === coach.id;
          return (
            <motion.div
              key={coach.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ y: -4 }}
            >
              <GlassCard
                glow={coach.color}
                className={`relative overflow-hidden text-center transition-all duration-500 ${isSelected ? "border-2 border-primary/50" : ""}`}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-3"
                  >
                    <div className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                      <Zap className="h-3 w-3" />
                      Active
                    </div>
                  </motion.div>
                )}

                <HolographicAvatar coach={coach} isSelected={isSelected} />

                <h4 className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground">
                  {coach.name}
                </h4>

                <div className="mt-2 flex items-center justify-center gap-2">
                  <NeonBadge color={coach.color}>{coach.specialty}</NeonBadge>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {coach.desc}
                </p>

                {/* Stats row */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {coach.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg bg-muted/30 px-3 py-2"
                    >
                      <div className="text-lg font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Experience & Users */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-chart-4" />
                    <span>{coach.experience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-chart-4" />
                    <span>{coach.activeUsers} active</span>
                  </div>
                </div>

                <Button
                  className={`mt-5 w-full transition-all duration-300 ${isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSelectedCoach(coach.id)}
                  data-ocid={`coaches.select_${coach.id}_button`}
                >
                  {isSelected ? (
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Selected Coach
                    </span>
                  ) : (
                    "Select Coach"
                  )}
                </Button>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
