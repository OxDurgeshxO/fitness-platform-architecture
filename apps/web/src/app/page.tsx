import React from "react";
import { PoseTracker } from "@/features/workout/PoseTracker";
import { ExerciseCatalogGrid } from "@/features/workout/ExerciseCatalogGrid";
import { NutritionCalculator } from "@/features/nutrition/NutritionCalculator";
import { LeaderboardWidget } from "@/features/gamification/LeaderboardWidget";
import WearablesWidget from "@/features/ecosystem/WearablesWidget";
import { Dumbbell, Sparkles, Cpu, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          Powered by MediaPipe & FastAPI Clean Architecture
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Intelligent Biomechanical{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            AI Fitness Coach
          </span>
        </h1>
        <p className="text-base md:text-lg text-slate-400 leading-relaxed">
          Real-time 33-point computer vision pose estimation, automated rep cadence counting,
          and dynamic posture correction engineered for enterprise fitness centers and athletes.
        </p>
      </section>

      {/* Main interactive pose tracking module */}
      <PoseTracker />

      {/* Dynamic Exercise Catalog Grid */}
      <div id="exercises">
        <ExerciseCatalogGrid />
      </div>

      {/* AI Nutritionist & Macro Planner */}
      <div id="nutrition">
        <NutritionCalculator />
      </div>

      {/* Gamification & Global Leaderboard */}
      <LeaderboardWidget />

      {/* Ecosystem & Wearables Telemetry */}
      <WearablesWidget />

      {/* Architecture Highlights */}
      <section id="stats" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Edge Computer Vision</h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Client-side WebGL acceleration paired with async Python MediaPipe backend for sub-50ms latency.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Clean Architecture API</h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            FastAPI with strict layer boundaries: DDD domain models, repository pattern, asyncpg, and JWT OAuth2 auth.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
            <Dumbbell className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Automated Cadence</h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Joint angle vertex mathematics (hip-knee-ankle) tracking full eccentric and concentric rep phases.
          </p>
        </div>
      </section>
    </div>
  );
}
