import { GlassCard } from "@/components/GlassCard";
import { NeonBadge } from "@/components/NeonBadge";
import { SectionHeader } from "@/components/SectionHeader";
import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  RotateCcw,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ── 4-week heatmap data (0 = rest, 1 = light, 2 = moderate, 3 = intense) ── */
const heatmapWeeks = [
  [1, 2, 0, 3, 2, 1, 0],
  [2, 3, 1, 2, 3, 2, 1],
  [1, 2, 2, 3, 1, 3, 0],
  [2, 3, 1, 2, 0, 0, 0], // current week (partial)
];

const intensityClass = (v: number) => {
  if (v === 0) return "bg-muted/40";
  if (v === 1) return "bg-chart-3/30";
  if (v === 2) return "bg-chart-3/60";
  return "bg-chart-3";
};

/* ── Motivational nudges ── */
const nudges = [
  "You're 3 workouts away from a new personal best!",
  "Consistency beats intensity — keep showing up.",
  "Your recovery score is excellent. Ready to push today?",
  "Morning workouts boost focus by 23%. Try one tomorrow!",
  "You've outperformed 78% of users this month.",
];

/* ── Upcoming workouts ── */
interface Workout {
  id: number;
  title: string;
  time: string;
  duration: string;
  type: string;
  completed: boolean;
}

const initialWorkouts: Workout[] = [
  {
    id: 1,
    title: "Upper Body Power",
    time: "Today, 6:00 PM",
    duration: "45 min",
    type: "Strength",
    completed: false,
  },
  {
    id: 2,
    title: "HIIT Cardio Blast",
    time: "Tomorrow, 7:00 AM",
    duration: "30 min",
    type: "Cardio",
    completed: false,
  },
  {
    id: 3,
    title: "Yoga Recovery",
    time: "Wed, 8:00 PM",
    duration: "60 min",
    type: "Flexibility",
    completed: false,
  },
  {
    id: 4,
    title: "Leg Day",
    time: "Thu, 6:00 PM",
    duration: "50 min",
    type: "Strength",
    completed: false,
  },
  {
    id: 5,
    title: "Core & Abs",
    time: "Fri, 7:00 AM",
    duration: "25 min",
    type: "Strength",
    completed: false,
  },
];

export function HabitsPage() {
  const [streak, setStreak] = useState(12);
  const [nudgeIndex, setNudgeIndex] = useState(0);
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [riskLevel, setRiskLevel] = useState<"Low" | "Medium" | "High">(
    "Medium",
  );

  /* Rotate nudges every 6s */
  useEffect(() => {
    const t = setInterval(
      () => setNudgeIndex((i) => (i + 1) % nudges.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  const toggleComplete = useCallback((id: number) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w)),
    );
    setStreak((s) => s + 1);
  }, []);

  const reschedule = useCallback((id: number) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              time: w.time
                .replace("Today", "Tomorrow")
                .replace("Tomorrow", "Wed"),
            }
          : w,
      ),
    );
  }, []);

  const riskColor =
    riskLevel === "Low"
      ? "green"
      : riskLevel === "Medium"
        ? "orange"
        : "purple";

  return (
    <div className="space-y-6">
      <SectionHeader
        title="AI Fitness Habit Tracker"
        subtitle="Behavioral analytics and adaptive scheduling"
      />

      {/* ── Top stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard glow="green" className="relative overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-4/20">
                <Flame className="h-7 w-7 text-chart-4" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-chart-4/10 blur-2xl" />
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <GlassCard glow="cyan">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">87%</p>
                <p className="text-xs text-muted-foreground">Consistency</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <GlassCard glow="purple">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-3/15">
                <Check className="h-7 w-7 text-chart-3" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">24</p>
                <p className="text-xs text-muted-foreground">Workouts Done</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Heatmap + Risk + Nudges row ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Heatmap */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">
                  Workout Calendar
                </h3>
              </div>
              <NeonBadge color="green">On Track</NeonBadge>
            </div>

            <div className="mt-6">
              {/* Day labels */}
              <div className="mb-2 grid grid-cols-7 gap-1.5">
                {weekDays.map((d) => (
                  <span
                    key={d}
                    className="text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {d}
                  </span>
                ))}
              </div>
              {/* 4-week grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {heatmapWeeks.flat().map((val, i) => {
                  const cellKey = `heatmap-${val}-${Math.floor(i / 7)}-${i % 7}`;
                  return (
                    <motion.div
                      key={cellKey}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: i * 0.01,
                        type: "spring",
                        stiffness: 300,
                      }}
                      className={`aspect-square rounded-md ${intensityClass(val)} transition-smooth hover:scale-110 hover:brightness-125`}
                      title={`Intensity: ${val}`}
                      data-ocid={`habits.heatmap.cell.${i + 1}`}
                    />
                  );
                })}
              </div>
              {/* Legend */}
              <div className="mt-4 flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-muted/40" /> Rest
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-chart-3/30" />{" "}
                  Light
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-chart-3/60" />{" "}
                  Moderate
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-chart-3" /> Intense
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Risk + Nudges */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {/* Skip-risk */}
          <GlassCard glow={riskLevel === "High" ? "purple" : "none"}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-chart-5" />
                <h3 className="font-display font-semibold text-foreground">
                  Skip Risk
                </h3>
              </div>
              <NeonBadge color={riskColor}>{riskLevel}</NeonBadge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {riskLevel === "Low"
                ? "Your schedule looks solid. Keep the momentum!"
                : riskLevel === "Medium"
                  ? "You missed 2 sessions recently. A light workout today could reset the pattern."
                  : "3 skips detected this week. Consider a 15-min recovery session to rebuild the chain."}
            </p>
            <div className="mt-4 flex gap-2">
              {(["Low", "Medium", "High"] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setRiskLevel(lvl)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-smooth ${
                    riskLevel === lvl
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-muted/40 text-muted-foreground border border-transparent hover:bg-muted"
                  }`}
                  data-ocid={`habits.risk.toggle.${lvl.toLowerCase()}`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Nudge feed */}
          <GlassCard>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-chart-4" />
              <h3 className="font-display font-semibold text-foreground">
                AI Nudge
              </h3>
            </div>
            <motion.div
              key={nudgeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-3"
            >
              <p className="text-sm leading-relaxed text-foreground">
                {nudges[nudgeIndex]}
              </p>
            </motion.div>
            <div className="mt-3 flex gap-1.5">
              {nudges.map((nudge, i) => (
                <div
                  key={`nudge-${nudge.slice(0, 8)}-${i}`}
                  className={`h-1 flex-1 rounded-full transition-smooth ${
                    i === nudgeIndex ? "bg-chart-4" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* ── Dynamic schedule adjustment ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-display font-semibold text-foreground">
                Upcoming Workouts
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {workouts.filter((w) => !w.completed).length} pending
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {workouts.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className={`flex flex-col gap-3 rounded-lg border p-4 transition-smooth sm:flex-row sm:items-center sm:justify-between ${
                  w.completed
                    ? "border-chart-3/30 bg-chart-3/5"
                    : "border-border/50 bg-background/40 hover:border-primary/30"
                }`}
                data-ocid={`habits.schedule.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      w.completed
                        ? "bg-chart-3/20 text-chart-3"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {w.completed ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Dumbbell className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`truncate font-medium ${w.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                    >
                      {w.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {w.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {w.duration}
                      </span>
                      <NeonBadge
                        color={
                          w.type === "Cardio"
                            ? "cyan"
                            : w.type === "Strength"
                              ? "green"
                              : "purple"
                        }
                      >
                        {w.type}
                      </NeonBadge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!w.completed ? (
                    <>
                      <button
                        type="button"
                        onClick={() => toggleComplete(w.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-chart-3/15 px-3 py-1.5 text-xs font-medium text-chart-3 transition-smooth hover:bg-chart-3/25"
                        data-ocid={`habits.schedule.complete_button.${i + 1}`}
                      >
                        <Check className="h-3.5 w-3.5" />
                        Complete
                      </button>
                      <button
                        type="button"
                        onClick={() => reschedule(w.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-smooth hover:bg-muted"
                        data-ocid={`habits.schedule.reschedule_button.${i + 1}`}
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reschedule
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleComplete(w.id)}
                      className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-smooth hover:bg-muted"
                      data-ocid={`habits.schedule.undo_button.${i + 1}`}
                    >
                      <X className="h-3.5 w-3.5" />
                      Undo
                    </button>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* ── This week quick view ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <GlassCard>
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">
              This Week
            </h3>
            <NeonBadge color="green">On Track</NeonBadge>
          </div>
          <div className="mt-6 flex justify-between gap-2">
            {weekDays.map((day, i) => {
              const currentWeek = heatmapWeeks[heatmapWeeks.length - 1];
              const val = currentWeek[i];
              const done = val > 0;
              return (
                <div
                  key={day}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-smooth ${
                      done
                        ? "bg-chart-3/20 text-chart-3"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {done ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <X className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{day}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
