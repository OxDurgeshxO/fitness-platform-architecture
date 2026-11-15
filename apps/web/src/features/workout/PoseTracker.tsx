"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, CameraOff, Play, RotateCcw, Activity, CheckCircle2, AlertCircle, BookmarkCheck } from "lucide-react";
import { useWorkoutStore } from "@/stores/workoutStore";
import { logWorkoutSet, QuickWorkoutLogResponse } from "@/lib/api";
import { WorkoutHistory } from "./WorkoutHistory";

export function PoseTracker() {
  const { exercise, reps, accuracy, angle, stage, feedback, isStreaming, setExercise, incrementReps, updateTelemetry, toggleStreaming, reset } = useWorkoutStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [sessionLogs, setSessionLogs] = useState<QuickWorkoutLogResponse[]>([]);
  const [loggingSet, setLoggingSet] = useState(false);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    if (isStreaming) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } })
        .then((stream) => {
          currentStream = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setStreamError(null);
        })
        .catch((err) => {
          setStreamError("Camera access denied or unavailable. Running in simulation mode.");
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    const handleCommitSet = async () => {
    if (reps <= 0) return;
    setLoggingSet(true);
    try {
      const recorded = await logWorkoutSet({
        exercise_type: exercise,
        reps,
        form_accuracy: accuracy / 100.0,
        duration_seconds: Math.max(30, reps * 3),
        athlete_weight_kg: 75.0,
      });
      setSessionLogs((prev) => [recorded, ...prev]);
      reset();
      updateTelemetry({
        feedback: `Recorded ${reps} reps to performance ledger! Ready for next set.`,
      });
    } catch (err) {
      console.error("Failed to commit set:", err);
    } finally {
      setLoggingSet(false);
    }
  };

  return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isStreaming]);

  // Simulated rep trigger for demo/verification
  const simulateRep = () => {
    incrementReps();
    updateTelemetry({
      angle: 85.0,
      stage: "down",
      feedback: "Great depth! Driving up through heels.",
      accuracy: 98,
    });
    setTimeout(() => {
      updateTelemetry({
        angle: 175.0,
        stage: "up",
        feedback: "Rep counted. Ready for next rep.",
      });
    }, 600);
  };

  const handleCommitSet = async () => {
    if (reps <= 0) return;
    setLoggingSet(true);
    try {
      const recorded = await logWorkoutSet({
        exercise_type: exercise,
        reps,
        form_accuracy: accuracy / 100.0,
        duration_seconds: Math.max(30, reps * 3),
        athlete_weight_kg: 75.0,
      });
      setSessionLogs((prev) => [recorded, ...prev]);
      reset();
      updateTelemetry({
        feedback: `Recorded ${reps} reps to performance ledger! Ready for next set.`,
      });
    } catch (err) {
      console.error("Failed to commit set:", err);
    } finally {
      setLoggingSet(false);
    }
  };

  return (
    <div id="tracker" className="w-full max-w-5xl mx-auto p-4 md:p-6 bg-slate-900/60 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            Biomechanical AI Pose Tracker
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            MediaPipe 33-landmark estimation coupled with FastAPI telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="squat">Squats (Hip-Knee Angle)</option>
            <option value="pushup">Pushups (Elbow-Shoulder Angle)</option>
            <option value="curl">Bicep Curls (Arm Flexion)</option>
          </select>

          <button
            onClick={toggleStreaming}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
              isStreaming
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
            }`}
          >
            {isStreaming ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            {isStreaming ? "Stop Camera" : "Start Camera"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Video / Visual Viewport */}
        <div className="lg:col-span-2 relative aspect-[4/3] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center">
          {isStreaming ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-slate-400 font-medium">Camera stream idle</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Click &quot;Start Camera&quot; for real-time video or use simulation triggers below.
              </p>
            </div>
          )}

          {/* Biomechanical Overlay HUD */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              STAGE: {stage.toUpperCase()}
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 backdrop-blur-md text-xs font-mono text-cyan-400">
              JOINT ANGLE: {angle.toFixed(1)}°
            </div>
          </div>

          {streamError && (
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {streamError}
            </div>
          )}
        </div>

        {/* Live Metrics Dashboard */}
        <div className="flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Reps</span>
              <div className="text-5xl font-extrabold text-white mt-1 font-mono tracking-tight text-emerald-400">
                {reps}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Form Accuracy</span>
              <div className="text-3xl font-bold text-white mt-1 flex items-baseline gap-2">
                <span>{accuracy}%</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Optimal biomechanics
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Coach Feedback</span>
              <p className="text-sm text-slate-300 mt-2 font-medium leading-relaxed">
                &ldquo;{feedback}&rdquo;
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={simulateRep}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                Simulate Rep
              </button>
              <button
                onClick={handleCommitSet}
                disabled={reps === 0 || loggingSet}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-md ${
                  reps > 0
                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                {loggingSet ? "Logging..." : `Log Set (${reps} reps)`}
              </button>
              <button
                onClick={reset}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reset stats"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Session Performance History */}
      <WorkoutHistory logs={sessionLogs} onClear={() => setSessionLogs([])} />
    </div>
  );
}
