import { cn } from "@/lib/utils";

interface NeonBadgeProps {
  children: React.ReactNode;
  color?: "cyan" | "purple" | "green" | "orange";
  className?: string;
}

export function NeonBadge({
  children,
  color = "cyan",
  className,
}: NeonBadgeProps) {
  const colorMap = {
    cyan: "bg-primary/15 text-primary border-primary/30 shadow-neon-cyan",
    purple: "bg-accent/15 text-accent border-accent/30 shadow-neon-purple",
    green: "bg-chart-3/15 text-chart-3 border-chart-3/30 shadow-neon-green",
    orange: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colorMap[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
