"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";
import Charts from "@/components/Charts";

interface PostureData {
  score: number;
  trend: string;
  lastUpdated: string;
  categories: Array<{
    name: string;
    score: number;
    status: string;
  }>;
}

export default function SecurityPosturePage() {
  const [postureData, setPostureData] = useState<PostureData | null>(null);

  useEffect(() => {
    const fetchPosture = async () => {
      try {
        const res = await fetch('/api/posture');
        if (res.ok) {
          setPostureData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch posture data:", error);
      }
    };
    fetchPosture();
  }, []);

  if (!postureData) {
    return <div className="p-6">Loading...</div>;
  }

  const categories = postureData.categories.map(cat => ({
    title: cat.name,
    score: `${cat.score}%`,
    issues: cat.status === "Excellent" ? 0 : cat.status === "Good" ? 1 : 2,
    icon: cat.status === "Excellent" ? ShieldCheck : cat.status === "Good" ? TrendingUp : AlertTriangle,
    color: cat.status === "Excellent" ? "text-emerald-600" : cat.status === "Good" ? "text-sky-600" : "text-amber-600",
    bg: cat.status === "Excellent" ? "bg-emerald-50" : cat.status === "Good" ? "bg-sky-50" : "bg-amber-50",
    border: cat.status === "Excellent" ? "border-emerald-200" : cat.status === "Good" ? "border-sky-200" : "border-amber-200",
  }));

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-700 max-w-[1800px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-card p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Security Posture</h1>
          <p className="text-slate-500 text-xs font-medium">Deep dive into your organizational security metrics.</p>
        </div>
        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-700">Score: {postureData.score}/100</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div key={i} className="glass-card p-6 rounded-2xl">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${cat.bg} ${cat.border} border shadow-sm`}>
                  <Icon className={`w-5 h-5 ${cat.color}`} />
                </div>
                <span className="text-2xl font-bold text-slate-900">{cat.score}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">{cat.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{cat.issues} active findings</p>
            </div>
          )
        })}
      </div>

      <Charts />
    </div>
  );
}
