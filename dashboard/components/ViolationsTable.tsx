"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, Clock, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Violation } from "@/lib/store";
import { API_BASE } from "@/lib/api";

export default function ViolationsTable({ limit = undefined }: { limit?: number }) {
  const [violations, setViolations] = useState<Violation[]>([]);

  useEffect(() => {
    const fetchViolations = async () => {
      const res = await fetch(`${API_BASE}/violations`);
      if (res.ok) {
        setViolations(await res.json());
      }
    };
    fetchViolations();
    const interval = setInterval(fetchViolations, 2000);
    return () => clearInterval(interval);
  }, []);

  const displayViolations = limit ? violations.slice(0, limit) : violations;

  const severityColor = (sev: string) => {
    switch (sev) {
      case "High": return "bg-[var(--error-bg)] text-[var(--error-text)] border-[var(--error-border)] shadow-sm";
      case "Medium": return "bg-[var(--warning-bg)] text-[var(--warning-text)] border-[var(--warning-border)]";
      default: return "bg-[var(--accent)]/10 text-[var(--accent-text)] border-[var(--accent-border)]";
    }
  };

  const statusColor = (status: string) => {
    return status === "Auto-Fixed"
      ? "text-[var(--success-text)] bg-[var(--success-bg)] border-[var(--success-border)]"
      : "text-[var(--error-text)] bg-[var(--error-bg)] border-[var(--error-border)] animate-pulse";
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-[var(--border)] flex justify-between items-center bg-[var(--surface)]/50">
        <div>
          <h3 className="font-semibold text-lg text-[var(--text)]">Security Violations</h3>
          <p className="text-[var(--text-secondary)] text-xs">Real-time threat detection feed</p>
        </div>
        <span className="px-3 py-1 bg-[var(--bg)] rounded-full text-[var(--text-secondary)] text-xs font-medium border border-[var(--border)] shadow-sm">
          {violations.length} total
        </span>
      </div>
      <div className="overflow-x-auto flex-1 bg-[var(--bg)]/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface)]/80">
              <th className="py-4 px-6 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Type</th>
              <th className="py-4 px-6 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Severity</th>
              <th className="py-4 px-6 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {displayViolations.length === 0 ? (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={4} className="py-12 text-center text-[var(--text-secondary)]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-[var(--success-bg)] rounded-full">
                        <ShieldCheck className="w-8 h-8 text-[var(--success-text)]" />
                      </div>
                      <p className="font-medium text-[var(--text)]">No violations detected</p>
                      <p className="text-xs">Your landing zone is secure</p>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                displayViolations.map((v) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    key={v.id} 
                    className="border-b border-[var(--border-secondary)] hover:bg-[var(--surface)]/80 transition-colors group"
                  >
                    <td className="py-4 px-6 font-medium text-[var(--text)]">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md ${v.status === 'Detected' ? 'bg-[var(--error-bg)]' : 'bg-[var(--surface)]'}`}>
                          <ShieldAlert className={`w-4 h-4 ${v.status === 'Detected' ? 'text-[var(--error-text)]' : 'text-[var(--text-secondary)]'}`} />
                        </div>
                        <span className="group-hover:text-[var(--text)] transition-colors">{v.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider uppercase ${severityColor(v.severity)}`}>
                        {v.severity}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 w-max tracking-wider uppercase ${statusColor(v.status)}`}>
                        {v.status === "Auto-Fixed" ? <ShieldCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {v.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-[var(--text-secondary)] text-right font-mono">
                      <div className="flex items-center justify-end gap-2 group-hover:text-[var(--text)] transition-colors">
                        {new Date(v.timestamp).toLocaleTimeString()}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

