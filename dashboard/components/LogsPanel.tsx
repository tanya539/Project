"use client";

import { useEffect, useState, useRef } from "react";
import { TerminalSquare, Search, Download, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LogEntry } from "@/lib/store";

export default function LogsPanel({ limit = undefined }: { limit?: number }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch('/api/logs');
      if (res.ok) {
        setLogs(await res.json());
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current && logs.length > 0) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [logs]);

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase())
  );

  const displayLogs = limit ? filteredLogs.slice(0, limit) : filteredLogs;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full relative">
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--surface)]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[var(--success-bg)] rounded-md">
            <TerminalSquare className="w-4 h-4 text-[var(--success-text)]" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text)] text-xs tracking-widest uppercase">Live Audit Events</h3>
            <p className="text-[10px] text-[var(--text-secondary)] font-mono">LIVE_FEED: ACTIVE</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-3 h-3 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filter logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[var(--bg)] border border-[var(--border)] rounded-lg py-1 pl-8 pr-3 text-[10px] text-[var(--text)] focus:outline-none focus:border-[var(--accent-border)] transition-colors w-40"
            />
          </div>
          <div className="flex gap-1.5">
            <button className="p-1.5 hover:bg-[var(--surface)] rounded-md text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
              <Download className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 hover:bg-[var(--surface)] rounded-md text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="p-4 overflow-y-auto flex-1 font-mono text-[11px] bg-[var(--bg-secondary)] scroll-smooth space-y-2.5 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {displayLogs.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[var(--text-secondary)] italic">
              No logs matching filter...
            </div>
          ) : (
            displayLogs.map((log, i) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={log.id} 
                className="group flex gap-3 border-l-2 border-transparent hover:border-[var(--accent-border)]/30 hover:bg-[var(--surface)]/5 pl-2 py-0.5 transition-all"
              >
                <span className="text-[var(--text-muted)] select-none shrink-0 font-bold">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-[var(--text-secondary)] select-none shrink-0 hidden sm:inline">|</span>
                <span className={
                  log.message.toLowerCase().includes("detected") || log.message.toLowerCase().includes("alert") || log.message.toLowerCase().includes("warning") || log.message.toLowerCase().includes("denied")
                    ? "text-[var(--error-accent)] font-bold" 
                    : log.message.toLowerCase().includes("remediated") || log.message.toLowerCase().includes("fixed") || log.message.toLowerCase().includes("pass")
                    ? "text-[var(--success-text)]"
                    : "text-[var(--text-secondary)]"
                }>
                  <span className="text-[var(--text-muted)] mr-2">$</span>
                  {log.message}
                </span>
                {i === 0 && (
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-3.5 bg-[var(--success-text)]/50 inline-block ml-1 self-center"
                  />
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--surface)] flex justify-between items-center text-[10px] text-[var(--text-secondary)] font-mono">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--success-text)] animate-pulse"></span> STDOUT</span>
          <span>UTF-8</span>
        </div>
        <span>LINE: {displayLogs.length}</span>
      </div>
    </div>
  );
}

