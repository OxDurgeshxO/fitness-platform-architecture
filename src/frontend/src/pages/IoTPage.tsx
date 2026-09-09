import { GlassCard } from "@/components/GlassCard";
import { NeonBadge } from "@/components/NeonBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { Slider } from "@/components/ui/slider";
import {
  Activity,
  Dumbbell,
  Flame,
  Footprints,
  Gauge,
  Heart,
  Settings2,
  Timer,
  Wifi,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type EquipmentStatus = "active" | "idle" | "maintenance";

interface EquipmentData {
  id: string;
  name: string;
  type: "treadmill" | "resistance" | "heartrate" | "calories";
  status: EquipmentStatus;
  metrics: Record<string, string | number>;
  sub: string;
  glow: "cyan" | "purple" | "green" | "none";
  badgeColor: "cyan" | "purple" | "green" | "orange";
  icon: React.ElementType;
  chartData: Array<{ time: string; value: number }>;
  chartColor: string;
  chartLabel: string;
  slider?: {
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    defaultValue: number;
  };
}

/* ------------------------------------------------------------------ */
/*  Simulated data helpers                                             */
/* ------------------------------------------------------------------ */

function generateTrend(
  base: number,
  variance: number,
  points = 12,
): Array<{ time: string; value: number }> {
  const times = [
    "00:00",
    "02:00",
    "04:00",
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00",
  ];
  return times.slice(0, points).map((time, i) => ({
    time,
    value: Math.round(
      base +
        Math.sin(i * 0.8) * variance +
        (Math.random() - 0.5) * variance * 0.5,
    ),
  }));
}

function useLiveMetric(baseValue: number, variance: number, interval = 2000) {
  const [value, setValue] = useState(baseValue);
  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => {
        const next = v + (Math.random() - 0.5) * variance;
        return Math.max(0, Math.round(next * 10) / 10);
      });
    }, interval);
    return () => clearInterval(id);
  }, [variance, interval]);
  return value;
}

/* ------------------------------------------------------------------ */
/*  Equipment definitions                                              */
/* ------------------------------------------------------------------ */

const baseEquipments: Omit<EquipmentData, "metrics" | "chartData">[] = [
  {
    id: "treadmill-a1",
    name: "Treadmill A1",
    type: "treadmill",
    status: "active",
    sub: "Session in progress",
    glow: "cyan",
    badgeColor: "cyan",
    icon: Footprints,
    chartColor: "#22d3ee",
    chartLabel: "Speed (km/h)",
    slider: {
      label: "Target Speed",
      min: 0,
      max: 20,
      step: 0.5,
      unit: "km/h",
      defaultValue: 8.5,
    },
  },
  {
    id: "resistance-r2",
    name: "Resistance R2",
    type: "resistance",
    status: "active",
    sub: "Set 4 of 6",
    glow: "purple",
    badgeColor: "purple",
    icon: Dumbbell,
    chartColor: "#c084fc",
    chartLabel: "Force (kg)",
    slider: {
      label: "Resistance Level",
      min: 1,
      max: 25,
      step: 1,
      unit: "lvl",
      defaultValue: 12,
    },
  },
  {
    id: "heartrate-h1",
    name: "Heart Rate Monitor",
    type: "heartrate",
    status: "active",
    sub: "Zone 3 — Aerobic",
    glow: "green",
    badgeColor: "green",
    icon: Heart,
    chartColor: "#4ade80",
    chartLabel: "BPM",
  },
  {
    id: "calorie-c1",
    name: "Calorie Counter",
    type: "calories",
    status: "idle",
    sub: "Last session: 420 kcal",
    glow: "none",
    badgeColor: "orange",
    icon: Flame,
    chartColor: "#fbbf24",
    chartLabel: "Calories (kcal)",
  },
];

/* ------------------------------------------------------------------ */
/*  Custom Recharts tooltip                                            */
/* ------------------------------------------------------------------ */

function ChartTooltip({
  active,
  payload,
  label,
}: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 text-xs">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-mono text-foreground">{payload[0].value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Equipment Card                                                     */
/* ------------------------------------------------------------------ */

function EquipmentCard({
  equipment,
  index,
}: {
  equipment: EquipmentData;
  index: number;
}) {
  const [sliderValue, setSliderValue] = useState(
    equipment.slider?.defaultValue ?? 0,
  );

  const statusLabel =
    equipment.status === "active"
      ? "Active"
      : equipment.status === "idle"
        ? "Idle"
        : "Maintenance";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.45,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <GlassCard glow={equipment.glow} className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                equipment.status === "active" ? "bg-primary/10" : "bg-muted/50"
              }`}
            >
              <equipment.icon
                className={`h-5 w-5 ${
                  equipment.status === "active"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-foreground">
                {equipment.name}
              </h4>
              <p className="text-xs text-muted-foreground">{equipment.sub}</p>
            </div>
          </div>
          <NeonBadge color={equipment.badgeColor}>{statusLabel}</NeonBadge>
        </div>

        {/* Metrics */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {Object.entries(equipment.metrics).map(([key, val]) => (
            <div key={key} className="rounded-lg bg-muted/30 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {key}
              </p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                {val}
              </p>
            </div>
          ))}
        </div>

        {/* Slider */}
        {equipment.slider && equipment.status === "active" && (
          <div className="mt-4 rounded-lg bg-muted/20 p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Settings2 className="h-3 w-3" />
                {equipment.slider.label}
              </span>
              <span className="font-mono text-xs font-semibold text-primary">
                {sliderValue} {equipment.slider.unit}
              </span>
            </div>
            <Slider
              defaultValue={[equipment.slider.defaultValue]}
              min={equipment.slider.min}
              max={equipment.slider.max}
              step={equipment.slider.step}
              onValueChange={(v) => setSliderValue(v[0])}
              className="mt-2"
              data-ocid={`iot.${equipment.id}.slider`}
            />
          </div>
        )}

        {/* Chart */}
        <div className="mt-4 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Activity className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {equipment.chartLabel}
            </span>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={equipment.chartData}
                margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
              >
                <defs>
                  <linearGradient
                    id={`grad-${equipment.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={equipment.chartColor}
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor={equipment.chartColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border) / 0.3)"
                />
                <XAxis
                  dataKey="time"
                  tick={{
                    fontSize: 10,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                  interval={2}
                />
                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                  width={30}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={equipment.chartColor}
                  strokeWidth={2}
                  fill={`url(#grad-${equipment.id})`}
                  dot={false}
                  activeDot={{ r: 4, fill: equipment.chartColor }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function IoTPage() {
  const liveSpeed = useLiveMetric(8.5, 0.8, 1500);
  const liveDistance = useLiveMetric(2.4, 0.05, 2000);
  const liveTime = useLiveMetric(12, 0.5, 3000);
  const liveResistance = useLiveMetric(12, 0.3, 2500);
  const liveReps = useLiveMetric(8, 0.1, 4000);
  const liveForce = useLiveMetric(45, 3, 2200);
  const liveBpm = useLiveMetric(142, 4, 1800);
  const liveZone = useLiveMetric(3, 0.05, 5000);
  const liveCalories = useLiveMetric(420, 2, 2000);

  const equipments: EquipmentData[] = useMemo(
    () =>
      baseEquipments.map((eq) => {
        const chartData = generateTrend(
          eq.type === "treadmill"
            ? 8
            : eq.type === "resistance"
              ? 45
              : eq.type === "heartrate"
                ? 135
                : 350,
          eq.type === "treadmill"
            ? 3
            : eq.type === "resistance"
              ? 15
              : eq.type === "heartrate"
                ? 20
                : 80,
        );

        let metrics: Record<string, string | number> = {};
        if (eq.type === "treadmill") {
          metrics = {
            Speed: `${liveSpeed.toFixed(1)} km/h`,
            Distance: `${liveDistance.toFixed(2)} km`,
            Time: `${Math.floor(liveTime)} min`,
          };
        } else if (eq.type === "resistance") {
          metrics = {
            Level: Math.round(liveResistance),
            Reps: Math.round(liveReps),
            Force: `${Math.round(liveForce)} kg`,
          };
        } else if (eq.type === "heartrate") {
          metrics = {
            BPM: Math.round(liveBpm),
            Zone: `Zone ${Math.max(1, Math.min(5, Math.round(liveZone)))}`,
            Variability: "±4 ms",
          };
        } else if (eq.type === "calories") {
          metrics = {
            Burned: `${Math.round(liveCalories)} kcal`,
            Rate: "8.2 kcal/min",
            Target: "600 kcal",
          };
        }

        return { ...eq, metrics, chartData };
      }),
    [
      liveSpeed,
      liveDistance,
      liveTime,
      liveResistance,
      liveReps,
      liveForce,
      liveBpm,
      liveZone,
      liveCalories,
    ],
  );

  /* Aggregate usage chart data */
  const usageData = useMemo(
    () =>
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
        day,
        treadmill: [40, 65, 30, 80, 55, 90, 45][i],
        resistance: [35, 50, 60, 45, 70, 55, 40][i],
        heartrate: [50, 55, 45, 60, 50, 65, 55][i],
        calories: [300, 450, 280, 520, 400, 600, 350][i],
      })),
    [],
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Smart Gym Assistant"
        subtitle="Real-time IoT equipment monitoring and control"
      />

      {/* Equipment Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {equipments.map((eq, i) => (
          <EquipmentCard key={eq.id} equipment={eq} index={i} />
        ))}
      </div>

      {/* Aggregate Usage Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  Equipment Usage Trends
                </h3>
                <p className="text-xs text-muted-foreground">
                  Weekly performance across all connected devices
                </p>
              </div>
            </div>
            <NeonBadge color="cyan">Live</NeonBadge>
          </div>

          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={usageData}
                margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border) / 0.3)"
                />
                <XAxis
                  dataKey="day"
                  tick={{
                    fontSize: 12,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                />
                <YAxis
                  tick={{
                    fontSize: 12,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                  width={40}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="treadmill"
                  name="Treadmill"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#22d3ee" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="resistance"
                  name="Resistance"
                  stroke="#c084fc"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#c084fc" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="heartrate"
                  name="Heart Rate"
                  stroke="#4ade80"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#4ade80" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  name="Calories"
                  stroke="#fbbf24"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#fbbf24" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {[
              { label: "Treadmill", color: "#22d3ee" },
              { label: "Resistance", color: "#c084fc" },
              { label: "Heart Rate", color: "#4ade80" },
              { label: "Calories", color: "#fbbf24" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.45 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            label: "Active Devices",
            value: "3/4",
            icon: Wifi,
            color: "text-primary",
          },
          {
            label: "Total Runtime",
            value: "42 min",
            icon: Timer,
            color: "text-chart-4",
          },
          {
            label: "Avg Intensity",
            value: "72%",
            icon: Gauge,
            color: "text-chart-3",
          },
          {
            label: "Energy Burned",
            value: "1,240 kcal",
            icon: Flame,
            color: "text-chart-2",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.75 + i * 0.08, duration: 0.35 }}
            >
              <GlassCard className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="font-mono text-lg font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
