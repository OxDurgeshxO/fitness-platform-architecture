import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "purple" | "green" | "orange" | "none";
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = "none",
  hover = true,
}: GlassCardProps) {
  const glowClass =
    glow === "cyan"
      ? "neon-glow-cyan"
      : glow === "purple"
        ? "neon-glow-purple"
        : glow === "green"
          ? "neon-glow-green"
          : glow === "orange"
            ? "neon-glow-orange"
            : "";
  return (
    <div
      className={cn(
        "glass-panel rounded-xl p-5 transition-smooth",
        hover && "hover:scale-[1.01] hover:border-primary/30",
        glowClass,
        className,
      )}
    >
      {children}
    </div>
  );
}
