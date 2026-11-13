"use client";

import React from "react";
import { Dumbbell, Flame, Trophy, Activity, CheckCircle2, Trash2 } from "lucide-react";
import { QuickWorkoutLogResponse } from "@/lib/api";

interface WorkoutHistoryProps {
  logs: QuickWorkoutLogResponse[];
  onClear: () => void;
}

export function WorkoutHistory({ logs, onClear }: WorkoutHistoryProps) {
  if (logs.length === 0) return null;

  const totalReps = logs.reduce((acc, curr) => acc + curr.reps, 0);
  const totalCalories = Math.round(logs.reduce((acc, curr) => acc + curr.estimated_calories_burned, 0));
  const avgAccuracy = Math.round(
    logs.reduce((acc, curr) => acc + curr.form_accuracy * 100, 0) / logs.length
  );
  const maxStrain = Math.max(...logs.map((l) => l.anabolic_strain_index));

  return (
    <section className="space-y-4 pt-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Live Session Performance Ledger
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Reps</span>
          <div className="text-2xl font-black text-white mt-0.5 font-mono text-emerald-400">{totalReps}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Calories
          </span>
          <div className="text-2xl font-black text-white mt-0.5 font-mono">{totalCalories} <span className="text-xs font-normal text-slate-400">kcal</span></div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Mean Accuracy</span>
          <div className="text-2xl font-black text-white mt-0.5 font-mono text-cyan-400">{avgAccuracy}%</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
            <Activity className="w-3.5 h-3.5 text-rose-400" /> Peak Strain
          </span>
          <div className="text-2xl font-black text-rose-400 mt-0.5 font-mono">{maxStrain}</div>
        </div>
      </div>

      {/* Itemized Set Cards */}
      <div className="space-y-2.5">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white capitalize text-sm">{log.exercise_type}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{log.feedback}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Volume</span>
                <span className="font-bold text-white font-mono">{log.reps} reps</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Energy</span>
                <span className="font-bold text-amber-400 font-mono">{log.estimated_calories_burned} kcal</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Kinematics</span>
                <span className="font-bold text-emerald-400 font-mono">{Math.round(log.form_accuracy * 100)}%</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider ${
                log.intensity_rating === "Peak"
                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  : log.intensity_rating === "High"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              }`}>
                {log.intensity_rating}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
