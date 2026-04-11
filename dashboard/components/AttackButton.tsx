"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Siren, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AttackButton() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [isAttacking, setIsAttacking] = useState(false);

  const simulateAttack = async () => {
    setIsAttacking(true);
    
    // Initial Detection Toast
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const toastId = toast.custom((_t) => (
      <div className="bg-[var(--bg)] border border-[var(--error-border)] p-4 rounded-xl shadow-xl flex items-start gap-3 min-w-[320px] animate-in slide-in-from-right-full">

        <div className="p-2 bg-[var(--error-bg)] rounded-lg">
          <Siren className="w-5 h-5 text-[var(--error-text)] animate-pulse" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-[var(--error-text)]">Security Violation Detected</h4>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Analyzing threat vector and impact...</p>
          <div className="w-full bg-[var(--surface)] h-1 mt-3 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
              className="bg-[var(--error-accent)] h-full"
            />
          </div>
        </div>
      </div>
    ), { duration: 3000 });

    try {
      const res = await fetch(`${API}/api/simulate`, { method: "POST" });
      const data = await res.json();
      
      if (res.ok) {
        // Wait for analysis
        setTimeout(async () => {
          toast.dismiss(toastId);
          
          // Remediation Toast
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          toast.custom((_t) => (
            <div className="bg-[var(--bg)] border border-[var(--success-border)] p-4 rounded-xl shadow-xl flex items-start gap-3 min-w-[320px] animate-in slide-in-from-right-full">
              <div className="p-2 bg-[var(--success-bg)] rounded-lg">
                <ShieldCheck className="w-5 h-5 text-[var(--success-text)]" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[var(--success-text)]">Auto-Remediation Successful</h4>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Lambda fixed: {data.violation.type}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-1.5 py-0.5 bg-[var(--success-bg)] text-[var(--success-text)] text-[8px] font-bold rounded uppercase border border-[var(--success-border)]">Fixed</span>
                  <span className="px-1.5 py-0.5 bg-[var(--surface)] text-[var(--text-secondary)] text-[8px] font-bold rounded uppercase border border-[var(--border)]">Audit Logged</span>
                </div>
              </div>
            </div>
          ), { duration: 4000 });

          // Update the violation to fixed
          await fetch(`${API}/api/violations`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: data.violation.id, status: "Auto-Fixed" })
          });
          
          setIsAttacking(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Simulation failed");
      setIsAttacking(false);
    }
  };

  return (
    <div className="relative group">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${isAttacking ? 'from-rose-400 to-rose-500' : 'from-sky-400 to-indigo-500'} rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse`}></div>
      <button
        onClick={simulateAttack}
        disabled={isAttacking}
        className={`
          relative w-full overflow-hidden rounded-lg font-bold text-[10px] sm:text-xs uppercase tracking-widest px-3 py-2
          transition-all duration-300 transform active:scale-[0.98]
          flex items-center justify-center gap-2
          border shadow-sm
          ${isAttacking 
            ? "bg-[var(--error-bg)] text-[var(--error-text)] border-[var(--error-border)] cursor-not-allowed" 
            : "bg-[var(--bg)] text-[var(--text)] border-[var(--border)] hover:border-[var(--accent-border)] hover:text-[var(--accent-text)]"}
        `}
      >
        {isAttacking ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Intercepting...</span>
          </>
        ) : (
          <>
            <Siren className="w-3.5 h-3.5" />
            <span>Simulate Attack</span>
          </>
        )}
      </button>
    </div>
  );
}

