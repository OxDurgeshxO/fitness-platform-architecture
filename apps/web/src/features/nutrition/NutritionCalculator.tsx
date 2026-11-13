"use client";

import React, { useState } from "react";
import { Utensils, Flame, Droplets, PieChart, Clock, Sparkles, Check, ChevronRight } from "lucide-react";
import { calculateNutritionPlan, NutritionPlanRequest, NutritionPlanResponse } from "@/lib/api";

export function NutritionCalculator() {
  const [formData, setFormData] = useState<NutritionPlanRequest>({
    weight_kg: 75,
    height_cm: 178,
    age: 25,
    gender: "male",
    activity_level: "moderate",
    goal: "hypertrophy",
  });

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<NutritionPlanResponse | null>(null);

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await calculateNutritionPlan(formData);
      setPlan(data);
    } catch (err) {
      console.error("Calculation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6 pt-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Utensils className="w-6 h-6 text-emerald-400" />
          AI Nutritionist & Anabolic Macro Planner
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Precision Mifflin-St Jeor TDEE calculation & high-protein nutrient partitioning tailored to athlete goals
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> Biometric Metrics
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400">Weight (kg)</label>
              <input
                type="number"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: parseFloat(e.target.value) || 0 })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Height (cm)</label>
              <input
                type="number"
                value={formData.height_cm}
                onChange={(e) => setFormData({ ...formData, height_cm: parseFloat(e.target.value) || 0 })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-emerald-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Activity Level</label>
            <select
              value={formData.activity_level}
              onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-emerald-500"
            >
              <option value="sedentary">Sedentary (Office / Little exercise)</option>
              <option value="light">Light (Exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (Exercise 3-5 days/week)</option>
              <option value="very_active">Very Active (Intense 6-7 days/week)</option>
              <option value="extra_active">Extra Active (Athlete / Physical job)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Primary Fitness Goal</label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-emerald-500"
            >
              <option value="hypertrophy">Muscle Hypertrophy (+300 kcal surplus)</option>
              <option value="maintenance">Lean Maintenance (0 kcal delta)</option>
              <option value="fat_loss">Fat Loss (-500 kcal deficit)</option>
              <option value="aggressive_cut">Aggressive Cut (-750 kcal deficit)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => handleCalculate()}
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {loading ? "Calculating..." : "Generate AI Nutrition Plan"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {plan ? (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">BMR</span>
                  <div className="text-2xl font-black text-white mt-1 font-mono">{plan.bmr}</div>
                  <span className="text-[10px] text-slate-500">kcal basal</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">TDEE</span>
                  <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">{plan.tdee}</div>
                  <span className="text-[10px] text-slate-500">kcal expenditure</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/40 text-center ring-1 ring-emerald-500/30">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center gap-1">
                    <Flame className="w-3 h-3" /> Target
                  </span>
                  <div className="text-2xl font-black text-white mt-1 font-mono">{plan.target_calories}</div>
                  <span className="text-[10px] text-emerald-400 font-semibold">kcal / day</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-400" /> Hydration
                  </span>
                  <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">{plan.water_intake_liters}L</div>
                  <span className="text-[10px] text-slate-500">water target</span>
                </div>
              </div>

              {/* Macro Partitioning */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-emerald-400" /> Daily Macronutrient Partitioning
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    P: {plan.daily_macros.protein_grams}g · C: {plan.daily_macros.carbs_grams}g · F: {plan.daily_macros.fat_grams}g
                  </span>
                </div>

                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
                  <div style={{ width: `${plan.daily_macros.protein_percentage}%` }} className="bg-emerald-500 h-full" title={`Protein: ${plan.daily_macros.protein_percentage}%`} />
                  <div style={{ width: `${plan.daily_macros.carbs_percentage}%` }} className="bg-cyan-500 h-full" title={`Carbs: ${plan.daily_macros.carbs_percentage}%`} />
                  <div style={{ width: `${plan.daily_macros.fat_percentage}%` }} className="bg-amber-500 h-full" title={`Fat: ${plan.daily_macros.fat_percentage}%`} />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1 text-center text-xs">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="font-bold text-emerald-400">Protein: {plan.daily_macros.protein_grams}g</span>
                    <span className="text-[10px] text-slate-400 block">{plan.daily_macros.protein_percentage}% ({plan.daily_macros.protein_calories} kcal)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <span className="font-bold text-cyan-400">Carbs: {plan.daily_macros.carbs_grams}g</span>
                    <span className="text-[10px] text-slate-400 block">{plan.daily_macros.carbs_percentage}% ({plan.daily_macros.carbs_calories} kcal)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <span className="font-bold text-amber-400">Fat: {plan.daily_macros.fat_grams}g</span>
                    <span className="text-[10px] text-slate-400 block">{plan.daily_macros.fat_percentage}% ({plan.daily_macros.fat_calories} kcal)</span>
                  </div>
                </div>
              </div>

              {/* 4-Meal Timeline */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" /> Optimal Anabolic Meal Schedule
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plan.meals.map((meal, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">{meal.meal_name}</span>
                        <span className="font-mono text-emerald-400 font-semibold">{meal.target_calories} kcal</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {meal.timing}
                      </div>
                      <ul className="space-y-1 pt-1">
                        {meal.recommended_items.map((it, iIdx) => (
                          <li key={iIdx} className="text-xs text-slate-400 flex items-center justify-between">
                            <span>• {it.name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">{it.calories} kcal ({it.protein_grams}g P)</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/20 border border-slate-800/60 border-dashed text-center">
              <Utensils className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-slate-400 font-medium text-sm">No plan generated yet</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Enter your physical parameters and click &ldquo;Generate AI Nutrition Plan&rdquo; to calculate TDEE and meal breakdown.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
