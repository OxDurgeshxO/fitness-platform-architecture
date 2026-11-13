"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Crown, Flame, Award, ShieldCheck, Zap, Sparkles, Target, ChevronRight } from "lucide-react";
import { fetchUserProgress, fetchAchievements, fetchLeaderboard, UserLevelProgress, Achievement, LeaderboardEntry } from "@/lib/api";

export function LeaderboardWidget() {
  const [progress, setProgress] = useState<UserLevelProgress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"leaderboard" | "badges">("leaderboard");

  useEffect(() => {
    fetchUserProgress().then(setProgress).catch(console.error);
    fetchAchievements().then(setAchievements).catch(console.error);
    fetchLeaderboard().then(setLeaderboard).catch(console.error);
  }, []);

  return (
    <section id="gamification" className="space-y-6 pt-6">
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            Athlete Progression & Global Leaderboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time XP leveling, streak tracking, and community competitive rankings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "leaderboard"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Global Rankings
          </button>
          <button
            onClick={() => setActiveTab("badges")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "badges"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Badges & Achievements
          </button>
        </div>
      </div>

      {/* Athlete Status Ribbon */}
      {progress && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
              {progress.current_level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white">{progress.tier_title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Level {progress.current_level}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {progress.total_xp} Total XP · {progress.completed_workouts_count} Workouts Completed
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-md space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Next Level: {progress.current_level + 1}</span>
              <span className="text-emerald-400 font-semibold">{progress.current_level_xp} / {progress.next_level_xp} XP ({progress.progress_percentage}%)</span>
            </div>
            <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
              <div
                style={{ width: `${progress.progress_percentage}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-slate-300"><strong className="text-white font-mono">{progress.streak_days} Days</strong> Streak</span>
          </div>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === "leaderboard" ? (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md overflow-hidden">
          <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Athlete</span>
            <div className="flex items-center gap-8">
              <span>Streak</span>
              <span>Total XP</span>
            </div>
          </div>
          <div className="divide-y divide-slate-800/60">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-bold font-mono ${
                    entry.rank === 1 ? "text-amber-400 text-sm font-black" : entry.rank === 2 ? "text-slate-300 font-black" : entry.rank === 3 ? "text-amber-600 font-black" : "text-slate-500"
                  }`}>
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                  </span>
                  <div>
                    <span className="font-bold text-white text-sm">{entry.athlete_name}</span>
                    <span className="text-[11px] text-slate-500 block font-mono">
                      Lvl {entry.level} · {entry.tier_title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8 font-mono">
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> {entry.streak_days}d
                  </span>
                  <span className="font-bold text-emerald-400 text-sm min-w-[70px] text-right">
                    {entry.total_xp.toLocaleString()} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all ${
                badge.is_unlocked
                  ? "bg-slate-900/60 border-emerald-500/40 shadow-sm"
                  : "bg-slate-950/40 border-slate-900 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  badge.is_unlocked
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-900 text-slate-600 border border-slate-800"
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{badge.title}</h4>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">+{badge.xp_reward} XP</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.description}</p>
                  <span className={`inline-block mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    badge.is_unlocked
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-slate-800 text-slate-500"
                  }`}>
                    {badge.is_unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
