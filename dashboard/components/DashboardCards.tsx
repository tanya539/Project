"use client";

import { useEffect, useState } from "react";
import { Server, Shield, AlertTriangle, Layers, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardCards() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [stats, setStats] = useState({
    totalAccounts: 3,
    activeResources: 25,
    securityScore: 92,
    activeViolations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`${API}/api/stats`);
      if (res.ok) {
        setStats(await res.json());
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { title: "Total Accounts", value: stats.totalAccounts, icon: Layers, color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10", trend: "+0%", trendColor: "text-[var(--text-secondary)]" },
    { title: "Active Resources", value: stats.activeResources, icon: Server, color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10", trend: "+12%", trendColor: "text-[var(--success-text)]" },
    { title: "Security Score", value: `${stats.securityScore}%`, icon: Shield, color: stats.securityScore > 80 ? "text-[var(--success-text)]" : "text-[var(--warning-text)]", bg: stats.securityScore > 80 ? "bg-[var(--success-bg)]" : "bg-[var(--warning-bg)]", trend: stats.securityScore > 90 ? "+2%" : "-5%", trendColor: stats.securityScore > 90 ? "text-[var(--success-text)]" : "text-[var(--error-text)]" },
    { title: "Active Violations", value: stats.activeViolations, icon: AlertTriangle, color: stats.activeViolations > 0 ? "text-[var(--error-text)]" : "text-[var(--text-secondary)]", bg: stats.activeViolations > 0 ? "bg-[var(--error-bg)]" : "bg-[var(--surface)]", trend: stats.activeViolations > 0 ? "+1" : "0", trendColor: stats.activeViolations > 0 ? "text-[var(--error-text)]" : "text-[var(--text-secondary)]" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass-card rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-white/20 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icon className="w-16 h-16 -mr-4 -mt-4 rotate-12" />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${card.trendColor}`}>
                {card.trend.startsWith("+") ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.trend}
              </div>
            </div>
            <div className="space-y-1 relative z-10">
              <h3 className="text-[var(--text-secondary)] font-medium text-sm">{card.title}</h3>
              <p className="text-3xl font-bold tracking-tight text-[var(--text)]">{card.value}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

