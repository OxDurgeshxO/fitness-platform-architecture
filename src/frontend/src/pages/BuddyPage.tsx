import { GlassCard } from "@/components/GlassCard";
import { NeonBadge } from "@/components/NeonBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Battery,
  Flame,
  Frown,
  MessageSquare,
  Send,
  Smile,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: number;
  sender: "buddy" | "user";
  text: string;
  timestamp: Date;
}

type Mood = "Happy" | "Energetic" | "Tired" | "Stressed" | "Motivated";

const moodConfig: Record<
  Mood,
  {
    icon: typeof Smile;
    color: "cyan" | "purple" | "green" | "orange";
    label: string;
  }
> = {
  Happy: { icon: Smile, color: "green", label: "Happy" },
  Energetic: { icon: Zap, color: "cyan", label: "Energetic" },
  Tired: { icon: Battery, color: "orange", label: "Tired" },
  Stressed: { icon: Frown, color: "purple", label: "Stressed" },
  Motivated: { icon: Flame, color: "green", label: "Motivated" },
};

const motivationalMessages = [
  "Every rep counts. You're building the future you, one set at a time.",
  "The only bad workout is the one that didn't happen.",
  "Your body can stand almost anything. It's your mind that you have to convince.",
  "Progress, not perfection. Show up today.",
  "Sweat is just fat crying. Keep pushing!",
  "Discipline beats motivation every single time.",
  "You don't have to be extreme, just consistent.",
  "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
];

function getBotResponse(userText: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi ") || lower === "hi") {
    return "Hey there! I'm your Virtual Gym Buddy. Ready to crush some goals today? 💪";
  }
  if (
    lower.includes("workout") ||
    lower.includes("exercise") ||
    lower.includes("training")
  ) {
    return "Let's get after it! Based on your recent activity, I'd suggest a strength-focused upper body session. Want me to outline a quick routine?";
  }
  if (
    lower.includes("diet") ||
    lower.includes("food") ||
    lower.includes("eat") ||
    lower.includes("nutrition")
  ) {
    return "Nutrition is 80% of the game. Are you tracking your macros? I can help you plan a high-protein meal for today. 🥗";
  }
  if (
    lower.includes("motivation") ||
    lower.includes("motivate") ||
    lower.includes("inspire")
  ) {
    return "Remember why you started. Every expert was once a beginner. You've got this! 🔥";
  }
  if (
    lower.includes("tired") ||
    lower.includes("exhausted") ||
    lower.includes("fatigue")
  ) {
    return "It's okay to feel tired. Rest is part of the process. How about a light mobility flow or a recovery stretch session? 🧘";
  }
  if (lower.includes("sore") || lower.includes("pain")) {
    return "Listen to your body. If it's muscle soreness, active recovery can help. If it's sharp pain, take a rest day. Want some stretch recommendations?";
  }
  if (lower.includes("goal") || lower.includes("target")) {
    return "Goals are dreams with deadlines. What's your target for this month? I can help you break it down into weekly milestones.";
  }
  if (lower.includes("water") || lower.includes("hydrate")) {
    return "Hydration check! Have you had at least 500ml of water in the last hour? Your muscles need it to perform. 💧";
  }
  return "That's interesting! Tell me more — I'm here to support your fitness journey every step of the way. 🏋️";
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "buddy",
    text: "Hey! Ready to crush today's workout? 💪",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 2,
    sender: "user",
    text: "Feeling a bit tired today",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: 3,
    sender: "buddy",
    text: "That's okay! Even a light session helps maintain your streak. How about a 20-minute mobility routine?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
];

export function BuddyPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [motivationIndex, setMotivationIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMotivationIndex((prev) => (prev + 1) % motivationalMessages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    inputRef.current?.focus();

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: "buddy",
        text: getBotResponse(trimmed),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Virtual Gym Buddy"
        subtitle="Your AI companion for motivation and emotional support"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat Panel */}
        <GlassCard className="lg:col-span-2" glow="cyan">
          <div className="flex h-[560px] flex-col">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                  <MessageSquare className="h-4 w-4 text-accent" />
                </div>
                <span className="font-display text-sm font-semibold text-foreground">
                  AI Gym Buddy
                </span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
              </div>
              {mood && (
                <NeonBadge color={moodConfig[mood].color}>
                  {(() => {
                    const Icon = moodConfig[mood].icon;
                    return <Icon className="h-3 w-3" />;
                  })()}
                  {moodConfig[mood].label}
                </NeonBadge>
              )}
            </div>

            <ScrollArea className="flex-1 pr-2" ref={scrollRef}>
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          msg.sender === "buddy"
                            ? "bg-accent/20"
                            : "bg-primary/20"
                        }`}
                      >
                        {msg.sender === "buddy" ? (
                          <MessageSquare className="h-4 w-4 text-accent" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex max-w-[80%] flex-col">
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            msg.sender === "buddy"
                              ? "glass-panel rounded-tl-none"
                              : "bg-primary/10 rounded-tr-none"
                          }`}
                        >
                          <p className="text-sm leading-relaxed text-foreground">
                            {msg.text}
                          </p>
                        </div>
                        <span
                          className={`mt-1 text-[10px] text-muted-foreground ${
                            msg.sender === "user" ? "text-right" : "text-left"
                          }`}
                        >
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              <Input
                ref={inputRef}
                placeholder="Message your gym buddy..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
                data-ocid="buddy.input"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                className="shrink-0"
                data-ocid="buddy.send_button"
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Mood Selector */}
          <GlassCard glow="purple">
            <h3 className="mb-3 font-display text-sm font-semibold text-foreground">
              How are you feeling?
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(moodConfig) as Mood[]).map((m) => {
                const Icon = moodConfig[m].icon;
                const active = mood === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMood(active ? null : m)}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-smooth ${
                      active
                        ? "border-primary/50 bg-primary/10 shadow-neon-cyan"
                        : "border-border bg-transparent hover:border-primary/30 hover:bg-primary/5"
                    }`}
                    data-ocid={`buddy.mood.${m.toLowerCase()}`}
                    aria-label={m}
                    type="button"
                  >
                    <Icon
                      className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {m}
                    </span>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Motivational Feed */}
          <GlassCard glow="green">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-chart-3" />
              <h3 className="font-display text-sm font-semibold text-foreground">
                Daily Motivation
              </h3>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={motivationIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="text-sm leading-relaxed text-muted-foreground"
              >
                {motivationalMessages[motivationIndex]}
              </motion.p>
            </AnimatePresence>
          </GlassCard>

          {/* Quick Tips */}
          <GlassCard>
            <h3 className="mb-3 font-display text-sm font-semibold text-foreground">
              Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Try typing "workout", "diet", "tired", or "motivation" for
                tailored responses.
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Set your mood to get context-aware coaching.
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Messages are session-persisted while you're here.
              </li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
