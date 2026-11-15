"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, Volume2, VolumeX, ShieldAlert, CheckCircle2 } from "lucide-react";
import { queryCoach, CoachQueryResponse } from "@/lib/api";

interface Message {
  sender: "user" | "coach";
  text: string;
  data?: CoachQueryResponse;
}

export function CoachChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "coach",
      text: "Greetings athlete! I am your AI Biomechanical Coach. Ask me about movement form correction, squat depth, macro planning, or recovery protocol.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await queryCoach({ message: textToSend });
      const coachMsg: Message = {
        sender: "coach",
        text: response.reply,
        data: response,
      };
      setMessages((prev) => [...prev, coachMsg]);
      speak(response.reply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "coach",
          text: "My neural link is momentarily congested. Ensure the FastAPI backend is running on :8000.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Fix knee pain during squats",
    "Optimal daily protein for hypertrophy",
    "Keep elbows tucked during pushups",
    "Recovery protocol for intense DOMS",
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-transform flex items-center gap-2 group"
      >
        <Bot className="w-6 h-6 text-slate-950" />
        <span className="hidden md:inline text-xs font-black uppercase tracking-wider pr-1">AI Coach</span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[92vw] sm:w-[440px] h-[580px] bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  Master Coach AI
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    v1.0
                  </span>
                </h3>
                <span className="text-[11px] text-slate-400">Biomechanical & Nutrition Specialist</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`p-2 rounded-xl transition-colors ${
                  ttsEnabled ? "text-emerald-400 bg-emerald-500/10" : "text-slate-500 hover:text-slate-300"
                }`}
                title={ttsEnabled ? "Voice Audio Active" : "Voice Audio Muted"}
              >
                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[88%] text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-emerald-500 text-slate-950 font-medium rounded-br-xs"
                      : "bg-slate-900/80 border border-slate-800 text-slate-200 rounded-bl-xs"
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Structured Actionable Cues */}
                  {m.data && m.data.actionable_cues && m.data.actionable_cues.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                        Actionable Cues:
                      </span>
                      {m.data.actionable_cues.map((cue, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{cue}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Safety Disclaimer */}
                  {m.data && m.data.safety_disclaimer && (
                    <div className="mt-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                      <span>{m.data.safety_disclaimer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 p-2 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                Analyzing biomechanics...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto">
            {quickPrompts.map((qp, qIdx) => (
              <button
                key={qIdx}
                onClick={() => handleSend(qp)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-medium text-slate-400 hover:text-emerald-300 border border-slate-800 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-800/80 bg-slate-900/30 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask form tips, macros, or technique..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold disabled:opacity-40 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
