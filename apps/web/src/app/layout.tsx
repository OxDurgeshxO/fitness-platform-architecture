import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar";
import { CoachChatDrawer } from "@/features/coach/CoachChatDrawer";

export const metadata: Metadata = {
  title: "AI Gym & Fitness Assistant | Intelligent Biomechanical Coach",
  description: "Next-generation AI gym ecosystem combining computer vision pose detection and real-time coaching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <main className="pt-24 pb-16 px-4">{children}</main>
        <CoachChatDrawer />
      </body>
    </html>
  );
}
