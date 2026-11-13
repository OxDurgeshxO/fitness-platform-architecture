"use client";

import React from "react";
import { Activity, Dumbbell, ShieldCheck, Flame } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Dumbbell className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
              AI Gym
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              v0.1
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#tracker" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            Live Pose Tracker
          </a>
          <a href="#exercises" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            Exercises
          </a>
          <a href="#nutrition" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-cyan-400" />
            AI Nutritionist
          </a>
          <a href="#gamification" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-yellow-400" />
            Leaderboard
          </a>
          <a
            href="http://127.0.0.1:8000/api/v1/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Backend API Docs
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            FastAPI Live :8000
          </span>
        </div>
      </div>
    </header>
  );
}
