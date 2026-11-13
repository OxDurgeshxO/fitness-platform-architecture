"use client";

import React, { useEffect, useState } from "react";
import { Dumbbell, Target, Compass, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import { fetchExercises, ExerciseProfile } from "@/lib/api";
import { useWorkoutStore } from "@/stores/workoutStore";

export function ExerciseCatalogGrid() {
  const [exercises, setExercises] = useState<ExerciseProfile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { exercise, setExercise, updateTelemetry, reset } = useWorkoutStore();

  useEffect(() => {
    fetchExercises().then((data) => setExercises(data));
  }, []);

  const categories = ["all", "strength", "hypertrophy", "core"];

  const filtered = selectedCategory === "all"
    ? exercises
    : exercises.filter((e) => e.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleSelect = (item: ExerciseProfile) => {
    setExercise(item.id);
    reset();
    updateTelemetry({
      exercise: item.id,
      feedback: `Targeting ${item.name}. ${item.correction_cues[0] || "Maintain optimal posture."}`,
      angle: item.max_angle_threshold,
    });
    // Smooth scroll up to tracker
    document.getElementById("tracker")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="space-y-6 pt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Dumbbell className="w-6 h-6 text-emerald-400" />
            Biomechanical Exercise Catalog
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Official kinematics profiles with joint angle tracking thresholds from FastAPI backend
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const isSelected = exercise === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleSelect(item)}
              className={`cursor-pointer group relative p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900/90 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50"
                  : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/70"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700/60">
                    {item.category}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active Target
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {item.name}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Target: <strong className="text-slate-200 font-medium">{item.target_muscle_groups.join(", ")}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Threshold: <strong className="text-slate-200 font-mono font-medium">{item.min_angle_threshold}° - {item.max_angle_threshold}°</strong></span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-2 italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                  &ldquo;{item.correction_cues[0]}&rdquo;
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 group-hover:text-slate-300 transition-colors flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  {item.joint_tracking_landmarks.length} Landmark Vertices
                </span>
                <span className={`flex items-center gap-0.5 transition-transform group-hover:translate-x-1 ${isSelected ? "text-emerald-400" : "text-slate-400"}`}>
                  Track Exercise <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
