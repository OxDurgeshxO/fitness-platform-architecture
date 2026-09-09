import { GlassCard } from "@/components/GlassCard";
import { NeonBadge } from "@/components/NeonBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Camera,
  CameraOff,
  Clock,
  Dumbbell,
  Minus,
  Play,
  Plus,
  Square,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface PoseLandmark {
  x: number;
  y: number;
  name: string;
}

interface PoseConnection {
  from: number;
  to: number;
}

// Simulated pose landmarks (normalized 0-1 coordinates)
const generatePoseLandmarks = (frame: number): PoseLandmark[] => {
  const breathe = Math.sin(frame * 0.05) * 0.02;
  const armSwing = Math.sin(frame * 0.08) * 0.15;

  return [
    { x: 0.5, y: 0.12 + breathe, name: "nose" },
    { x: 0.45, y: 0.18 + breathe, name: "left_eye" },
    { x: 0.55, y: 0.18 + breathe, name: "right_eye" },
    { x: 0.42, y: 0.22 + breathe, name: "left_ear" },
    { x: 0.58, y: 0.22 + breathe, name: "right_ear" },
    { x: 0.35, y: 0.28 + breathe, name: "left_shoulder" },
    { x: 0.65, y: 0.28 + breathe, name: "right_shoulder" },
    { x: 0.25 + armSwing, y: 0.42 + breathe, name: "left_elbow" },
    { x: 0.75 - armSwing, y: 0.42 + breathe, name: "right_elbow" },
    { x: 0.18 + armSwing * 1.5, y: 0.55 + breathe, name: "left_wrist" },
    { x: 0.82 - armSwing * 1.5, y: 0.55 + breathe, name: "right_wrist" },
    { x: 0.38, y: 0.48 + breathe, name: "left_hip" },
    { x: 0.62, y: 0.48 + breathe, name: "right_hip" },
    { x: 0.35, y: 0.68 + breathe, name: "left_knee" },
    { x: 0.65, y: 0.68 + breathe, name: "right_knee" },
    { x: 0.33, y: 0.88 + breathe, name: "left_ankle" },
    { x: 0.67, y: 0.88 + breathe, name: "right_ankle" },
  ];
};

const poseConnections: PoseConnection[] = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 },
  { from: 5, to: 6 },
  { from: 5, to: 7 },
  { from: 7, to: 9 },
  { from: 6, to: 8 },
  { from: 8, to: 10 },
  { from: 5, to: 11 },
  { from: 6, to: 12 },
  { from: 11, to: 12 },
  { from: 11, to: 13 },
  { from: 13, to: 15 },
  { from: 12, to: 14 },
  { from: 14, to: 16 },
];

const coachingMessages = [
  {
    text: "Keep your back straight",
    type: "tip" as const,
    color: "cyan" as const,
  },
  {
    text: "Great form!",
    type: "encouragement" as const,
    color: "green" as const,
  },
  {
    text: "Lower slowly on the way down",
    type: "tip" as const,
    color: "cyan" as const,
  },
  {
    text: "You're crushing it!",
    type: "encouragement" as const,
    color: "green" as const,
  },
  { text: "Engage your core", type: "tip" as const, color: "purple" as const },
  {
    text: "Halfway there!",
    type: "encouragement" as const,
    color: "green" as const,
  },
  {
    text: "Breathe out on exertion",
    type: "tip" as const,
    color: "cyan" as const,
  },
  {
    text: "Perfect tempo!",
    type: "encouragement" as const,
    color: "green" as const,
  },
];

export function TrainerPage() {
  const [isActive, setIsActive] = useState(false);
  const [reps, setReps] = useState(0);
  const [formScore, setFormScore] = useState(0);
  const [duration, setDuration] = useState(0);
  const [feedback, setFeedback] = useState<
    { text: string; type: string; color: "cyan" | "purple" | "green" }[]
  >([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameCountRef = useRef(0);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setHasPermission(true);
      setCameraError(null);
    } catch (_err) {
      setCameraError("Camera access denied or unavailable");
      setHasPermission(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasPermission(false);
  }, []);

  const drawPoseOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !hasPermission) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const landmarks = generatePoseLandmarks(frameCountRef.current);
    frameCountRef.current += 1;

    // Draw connections
    ctx.strokeStyle = "oklch(0.75 0.18 190 / 0.6)";
    ctx.lineWidth = 3;
    for (const conn of poseConnections) {
      const from = landmarks[conn.from];
      const to = landmarks[conn.to];
      if (from && to) {
        ctx.beginPath();
        ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
        ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
        ctx.stroke();
      }
    }

    // Draw landmarks
    for (const landmark of landmarks) {
      const x = landmark.x * canvas.width;
      const y = landmark.y * canvas.height;

      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = "oklch(0.75 0.18 190 / 0.3)";
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "oklch(0.85 0.15 190 / 0.9)";
      ctx.fill();
    }

    // Draw joint labels for key points
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillStyle = "oklch(0.9 0.05 190 / 0.7)";
    const keyPoints = [0, 5, 6, 9, 10, 13, 14, 15, 16];
    for (const idx of keyPoints) {
      const lm = landmarks[idx];
      if (lm) {
        ctx.fillText(
          lm.name,
          lm.x * canvas.width + 10,
          lm.y * canvas.height + 3,
        );
      }
    }
  }, [hasPermission]);

  const animate = useCallback(() => {
    if (isActive) {
      drawPoseOverlay();
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [isActive, drawPoseOverlay]);

  useEffect(() => {
    if (isActive) {
      startCamera();
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
        setFormScore((s) => Math.min(100, s + Math.random() * 2));

        // Add coaching feedback periodically
        if (Math.random() > 0.7) {
          const msg =
            coachingMessages[
              Math.floor(Math.random() * coachingMessages.length)
            ];
          setFeedback((prev) => {
            const next = [
              ...prev,
              { text: msg.text, type: msg.type, color: msg.color },
            ];
            return next.slice(-6);
          });
        }
      }, 1000);
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      stopCamera();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setDuration(0);
      setFormScore(0);
      setReps(0);
      setFeedback([]);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isActive, startCamera, stopCamera, animate]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const incrementReps = () => setReps((r) => r + 1);
  const decrementReps = () => setReps((r) => Math.max(0, r - 1));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="AI Gym Trainer"
        subtitle="Real-time pose analysis, rep counting, and form feedback"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Camera Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="lg:col-span-2"
        >
          <GlassCard
            className="relative overflow-hidden p-0"
            glow={isActive ? "cyan" : "none"}
          >
            <div className="relative aspect-video bg-black">
              {hasPermission ? (
                <>
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    muted
                    playsInline
                    data-ocid="trainer.video_feed"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 h-full w-full"
                    data-ocid="trainer.pose_canvas"
                  />
                  {/* Overlay UI */}
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <NeonBadge color={isActive ? "green" : "cyan"}>
                      <span className="flex items-center gap-1">
                        <span
                          className={`h-2 w-2 rounded-full ${isActive ? "animate-pulse bg-green-400" : "bg-cyan-400"}`}
                        />
                        {isActive ? "LIVE" : "READY"}
                      </span>
                    </NeonBadge>
                  </div>
                  <div className="absolute right-3 top-3">
                    <NeonBadge color="purple">
                      <Activity className="h-3 w-3" />
                      {Math.round(formScore)}% Form
                    </NeonBadge>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  {cameraError ? (
                    <>
                      <CameraOff className="h-12 w-12 text-destructive/60" />
                      <p className="mt-3 text-sm text-destructive/80">
                        {cameraError}
                      </p>
                    </>
                  ) : (
                    <>
                      <Camera className="h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-3 text-sm text-muted-foreground">
                        Camera feed will appear here
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between border-t border-border/30 p-4">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsActive(!isActive)}
                  className={
                    isActive
                      ? "bg-destructive hover:bg-destructive/90"
                      : "bg-primary hover:bg-primary/90"
                  }
                  data-ocid="trainer.toggle_button"
                >
                  {isActive ? (
                    <Square className="mr-2 h-4 w-4" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {isActive ? "Stop Session" : "Start Session"}
                </Button>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementReps}
                      data-ocid="trainer.decrement_reps"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-mono text-lg font-bold text-primary min-w-[3ch] text-center">
                      {reps}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementReps}
                      data-ocid="trainer.increment_reps"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">reps</span>
                  </motion.div>
                )}
              </div>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{formatDuration(duration)}</span>
                </motion.div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Session Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          >
            <GlassCard glow="purple">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h3 className="font-display font-semibold text-foreground">
                  Session Stats
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Reps</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-bold text-primary">
                      {reps}
                    </span>
                    {isActive && (
                      <motion.div
                        key={reps}
                        initial={{ scale: 1.3, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-xs text-primary/60"
                      >
                        +1
                      </motion.div>
                    )}
                  </div>
                </div>
                <div className="h-px bg-border/30" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Form Score
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-chart-3"
                        initial={{ width: 0 }}
                        animate={{ width: `${formScore}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="font-mono text-chart-3 min-w-[3ch]">
                      {isActive ? Math.round(formScore) : "--"}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-border/30" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Duration
                  </span>
                  <span className="font-mono text-foreground">
                    {formatDuration(duration)}
                  </span>
                </div>
                <div className="h-px bg-border/30" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Calories
                  </span>
                  <span className="font-mono text-chart-4">
                    {isActive ? Math.round(duration * 0.15) : "0"}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Coaching Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <GlassCard glow="green">
              <h3 className="font-display font-semibold text-foreground mb-3">
                Coaching Feedback
              </h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {feedback.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-6 text-muted-foreground"
                      data-ocid="trainer.feedback.empty_state"
                    >
                      <Dumbbell className="h-8 w-8 mb-2 opacity-40" />
                      <p className="text-sm">
                        Start a session to get real-time feedback
                      </p>
                    </motion.div>
                  ) : (
                    feedback.map((msg, index) => (
                      <motion.div
                        key={`${msg.text}-${index}`}
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.3 }}
                        data-ocid={`trainer.feedback.item.${index + 1}`}
                      >
                        <NeonBadge
                          color={msg.color}
                          className="w-full justify-start"
                        >
                          {msg.type === "encouragement" ? "★" : "→"} {msg.text}
                        </NeonBadge>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
