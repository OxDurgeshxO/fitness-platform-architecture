import { GlassCard } from "@/components/GlassCard";
import { NeonBadge } from "@/components/NeonBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { Activity, Dumbbell, Gauge, Layers, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const weeklyScores = [
  { day: "Mon", score: 82, efficiency: 78 },
  { day: "Tue", score: 88, efficiency: 84 },
  { day: "Wed", score: 85, efficiency: 82 },
  { day: "Thu", score: 91, efficiency: 89 },
  { day: "Fri", score: 89, efficiency: 87 },
  { day: "Sat", score: 94, efficiency: 92 },
  { day: "Sun", score: 92, efficiency: 90 },
];

const exerciseBreakdown = [
  { name: "Squats", minutes: 45, color: "#22d3ee" },
  { name: "Deadlifts", minutes: 30, color: "#a78bfa" },
  { name: "Bench Press", minutes: 25, color: "#34d399" },
  { name: "Pull-ups", minutes: 20, color: "#fbbf24" },
  { name: "Planks", minutes: 15, color: "#f87171" },
  { name: "Lunges", minutes: 18, color: "#60a5fa" },
];

const progressMetrics = [
  {
    label: "Avg Score",
    value: "88.7",
    change: "+2.3",
    icon: Gauge,
    color: "text-primary",
    glow: "cyan" as const,
  },
  {
    label: "Total Reps",
    value: "1,248",
    change: "+156",
    icon: Dumbbell,
    color: "text-chart-3",
    glow: "green" as const,
  },
  {
    label: "Form Rating",
    value: "92%",
    change: "+4%",
    icon: Activity,
    color: "text-accent",
    glow: "purple" as const,
  },
  {
    label: "Consistency",
    value: "96%",
    change: "+1%",
    icon: Layers,
    color: "text-chart-4",
    glow: "none" as const,
  },
];

function PerformanceGauge({ score }: { score: number }) {
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const arc = circumference * 0.75;
  const dashoffset = arc - (score / 100) * arc;

  return (
    <div
      className="relative flex items-center justify-center"
      data-ocid="analyzer.gauge.panel"
    >
      <svg
        role="img"
        aria-label="Performance gauge showing score 88 out of 100"
        width={radius * 2.5}
        height={radius * 2}
        viewBox={`0 0 ${radius * 2.5} ${radius * 2}`}
        className="transform -rotate-[135deg]"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <circle
          stroke="oklch(var(--muted) / 0.3)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${arc} ${circumference - arc}`}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius * 1.25}
          cy={radius}
        />
        <motion.circle
          stroke="url(#gaugeGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${arc} ${circumference - arc}`}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius * 1.25}
          cy={radius}
          initial={{ strokeDashoffset: arc }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          className="neon-glow-cyan"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-bold text-foreground">
          {score}
        </span>
        <span className="mt-1 text-sm font-medium text-muted-foreground">
          Overall Score
        </span>
      </div>
    </div>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel rounded-lg border border-border/50 px-3 py-2">
        <p className="text-xs font-medium text-foreground">{label}</p>
        {payload.map((entry) => (
          <p
            key={`tooltip-${entry.name}`}
            className="text-xs text-muted-foreground"
          >
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function AnalyzerPage() {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <SectionHeader
          title="Pose-to-Performance Analyzer"
          subtitle="Motion efficiency analysis and performance scoring"
        />
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {progressMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              variants={itemVariants}
              custom={index}
            >
              <GlassCard
                glow={metric.glow}
                className="relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className={`mt-1 text-3xl font-bold ${metric.color}`}>
                      {metric.value}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-chart-3">
                      <TrendingUp className="h-3 w-3" />
                      {metric.change} vs last week
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants}>
          <GlassCard glow="cyan" className="flex flex-col items-center">
            <div className="mb-4 flex w-full items-center justify-between">
              <h3 className="font-display font-semibold text-foreground">
                Overall Performance Score
              </h3>
              <NeonBadge color="cyan">Elite</NeonBadge>
            </div>
            <PerformanceGauge score={88} />
            <div className="mt-4 grid w-full grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Form</p>
                <p className="text-lg font-bold text-primary">92%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ROM</p>
                <p className="text-lg font-bold text-accent">85%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stability</p>
                <p className="text-lg font-bold text-chart-3">87%</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard glow="green" className="h-full">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-semibold text-foreground">
                Motion Efficiency Trend
              </h3>
              <NeonBadge color="green">+8.2%</NeonBadge>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyScores}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(var(--border) / 0.3)"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{
                      fill: "oklch(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    axisLine={{ stroke: "oklch(var(--border) / 0.3)" }}
                  />
                  <YAxis
                    domain={[60, 100]}
                    tick={{
                      fill: "oklch(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    axisLine={{ stroke: "oklch(var(--border) / 0.3)" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Score"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={{ fill: "#22d3ee", strokeWidth: 0, r: 4 }}
                    activeDot={{
                      r: 6,
                      fill: "#22d3ee",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    name="Efficiency"
                    stroke="#34d399"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#34d399", strokeWidth: 0, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <GlassCard glow="purple">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">
              Exercise Breakdown
            </h3>
            <NeonBadge color="purple">This Week</NeonBadge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={exerciseBreakdown}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border) / 0.3)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{
                    fill: "oklch(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                  axisLine={{ stroke: "oklch(var(--border) / 0.3)" }}
                  label={{
                    value: "Minutes",
                    position: "insideBottom",
                    offset: -5,
                    fill: "oklch(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{
                    fill: "oklch(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                  axisLine={{ stroke: "oklch(var(--border) / 0.3)" }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="minutes" name="Minutes" radius={[0, 4, 4, 0]}>
                  {exerciseBreakdown.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
