"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  analyzeHeartRate,
  exportAthleteData,
  HeartRateZoneAnalysis,
  AthleteDataExportResponse,
} from "../../lib/api";

const ZONE_COLORS: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  "Zone 1": {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
    bar: "bg-blue-500",
  },
  "Zone 2": {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    bar: "bg-emerald-500",
  },
  "Zone 3": {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    bar: "bg-yellow-500",
  },
  "Zone 4": {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/30",
    bar: "bg-orange-500",
  },
  "Zone 5": {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
    bar: "bg-rose-500",
  },
};

export default function WearablesWidget() {
  const [bpm, setBpm] = useState<number>(142);
  const [device, setDevice] = useState<string>("Apple Watch Ultra 2");
  const [zoneData, setZoneData] = useState<HeartRateZoneAnalysis | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [exportData, setExportData] = useState<AthleteDataExportResponse | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // Sync heart rate analysis
  useEffect(() => {
    let isMounted = true;
    async function fetchAnalysis() {
      try {
        const res = await analyzeHeartRate({
          athlete_age: 26,
          resting_heart_rate: 54,
          current_heart_rate: bpm,
          device_name: device,
        });
        if (isMounted) {
          setZoneData(res);
        }
      } catch (err) {
        console.error("Heart rate analysis error:", err);
      }
    }
    fetchAnalysis();
    return () => {
      isMounted = false;
    };
  }, [bpm, device]);

  // Simulated live biometric streaming
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setBpm((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(90, Math.min(185, prev + delta));
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await exportAthleteData();
      setExportData(data);
      setExportSuccess(true);

      // Create downloadable JSON blob
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `athlete_fitness_export_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setTimeout(() => setExportSuccess(false), 3500);
    } catch (err) {
      console.error("Export failure:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const zoneKey = zoneData ? zoneData.current_zone.split(" ")[0] + " " + zoneData.current_zone.split(" ")[1] : "Zone 2";
  const colors = ZONE_COLORS[zoneKey] || ZONE_COLORS["Zone 2"];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isLiveStreaming ? "bg-rose-400" : "bg-slate-500"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isLiveStreaming ? "bg-rose-500" : "bg-slate-600"
                }`}
              />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Wearables & Biometric Ecosystem
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Tanaka/Karvonen metabolic zone telemetry & GDPR portable export
          </p>
        </div>

        {/* Live Simulator & Device Select */}
        <div className="flex items-center gap-3">
          <select
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className="rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="Apple Watch Ultra 2">Apple Watch Ultra 2</option>
            <option value="Garmin Forerunner 965">Garmin Forerunner 965</option>
            <option value="Polar H10 Chest Strap">Polar H10 Chest Strap</option>
            <option value="WHOOP 4.0 Strap">WHOOP 4.0 Strap</option>
          </select>
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isLiveStreaming
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
            }`}
          >
            {isLiveStreaming ? "Pause Live Sync" : "Resume Stream"}
          </button>
        </div>
      </div>

      {/* Primary HR Telemetry & Zone Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Big BPM Gauge */}
        <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/60 border border-slate-800 text-center relative overflow-hidden">
          <div
            className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none ${colors.bar}`}
          />
          <motion.div
            key={bpm}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-baseline gap-2"
          >
            <span className="text-5xl font-black tracking-tight text-white font-mono">
              {bpm}
            </span>
            <span className="text-sm font-semibold uppercase text-rose-500">BPM</span>
          </motion.div>
          <span className="text-xs text-slate-400 mt-2">
            Resting: 54 BPM | Max: {zoneData?.max_heart_rate ?? 190} BPM
          </span>

          {/* Interactive slider for manual verification */}
          <div className="w-full mt-4 space-y-1">
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>90 BPM</span>
              <span>Manual Override</span>
              <span>185 BPM</span>
            </div>
            <input
              type="range"
              min={90}
              max={185}
              value={bpm}
              onChange={(e) => {
                setIsLiveStreaming(false);
                setBpm(Number(e.target.value));
              }}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Metabolic Zone Card */}
        <div className="md:col-span-2 flex flex-col justify-between p-6 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Active Training State
              </span>
              <h3 className={`text-xl font-bold mt-1 ${colors.text}`}>
                {zoneData?.current_zone || "Calculating..."}
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {zoneData?.heart_rate_reserve_pct ?? 0}% HRR
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {zoneData?.zone_description || "Real-time autonomic feedback streaming."}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block">Target Range:</span>
              <span className="font-semibold text-slate-200">
                {zoneData?.target_bpm_range || "Syncing"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Physiological Adaptation:</span>
              <span className="font-semibold text-emerald-400">
                {zoneData?.training_effect || "Aerobic Conditioning"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Zone Progression Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Metabolic Zone Distribution</span>
          <span className="text-slate-500">Zone 1 → Zone 5 (VO2 Max)</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 h-2.5 rounded-full overflow-hidden bg-slate-950 p-0.5 border border-slate-800">
          <div
            className={`rounded-sm transition-all duration-500 ${
              zoneKey.startsWith("Zone 1") ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" : "bg-blue-950/60"
            }`}
          />
          <div
            className={`rounded-sm transition-all duration-500 ${
              zoneKey.startsWith("Zone 2") ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-emerald-950/60"
            }`}
          />
          <div
            className={`rounded-sm transition-all duration-500 ${
              zoneKey.startsWith("Zone 3") ? "bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]" : "bg-yellow-950/60"
            }`}
          />
          <div
            className={`rounded-sm transition-all duration-500 ${
              zoneKey.startsWith("Zone 4") ? "bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]" : "bg-orange-950/60"
            }`}
          />
          <div
            className={`rounded-sm transition-all duration-500 ${
              zoneKey.startsWith("Zone 5") ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" : "bg-rose-950/60"
            }`}
          />
        </div>
      </div>

      {/* Data Sovereignty & GDPR/HIPAA Export Panel */}
      <div className="rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800/80 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              Data Sovereignty & Portability
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              GDPR Art. 20 / HIPAA
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Export complete encrypted fitness telemetry, biomechanical scores, and workout logs as JSON.
          </p>
        </div>

        <button
          onClick={handleExportData}
          disabled={isExporting}
          className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-tight transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
        >
          {isExporting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full" />
              Packaging Archive...
            </span>
          ) : exportSuccess ? (
            <span className="text-emerald-950 font-black">✓ Export Downloaded</span>
          ) : (
            "Export Telemetry (.json)"
          )}
        </button>
      </div>
    </div>
  );
}
