import { useIsMobile } from "@/hooks/use-mobile";
import { Outlet } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface CoachContextType {
  selectedCoach: string | null;
  setSelectedCoach: (coach: string | null) => void;
}

const CoachContext = createContext<CoachContextType>({
  selectedCoach: null,
  setSelectedCoach: () => {},
});

export function useCoach() {
  return useContext(CoachContext);
}

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const isMobile = useIsMobile();

  return (
    <CoachContext.Provider value={{ selectedCoach, setSelectedCoach }}>
      <div className="flex h-screen overflow-hidden bg-background relative">
        {/* BETA AUDIT PREVIEW BADGE */}
        <div style={{ position: 'fixed', bottom: '16px', right: '16px', zIndex: 99999, background: 'rgba(239, 68, 68, 0.95)', color: '#ffffff', padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em', boxShadow: '0 4px 14px rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          🏷️ BETA AUDIT PREVIEW
        </div>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
          selectedCoach={selectedCoach}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header selectedCoach={selectedCoach} />
          <main className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
          {isMobile && <div className="h-16" />}
        </div>
      </div>
    </CoachContext.Provider>
  );
}
