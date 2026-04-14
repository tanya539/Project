"use client";

import { useEffect, useState } from "react";
import { Shield, Layout, Settings, Activity, Cpu, Key } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface ArchCardProps {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ArchitectureData {
  components: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  }>;
  controlFlow: string[];
}

const DEFAULT_COMPONENTS = [
  {
    id: "accounts",
    name: "AWS Accounts",
    description: "Security, log archive, and shared services account model.",
    icon: "Layout",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "iam",
    name: "Identity & Access",
    description: "Federated access and least-privilege role boundaries.",
    icon: "Key",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "guardrails",
    name: "Guardrails",
    description: "SCP and Config controls enforce policy-as-code.",
    icon: "Shield",
    color: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  },
  {
    id: "monitoring",
    name: "Monitoring",
    description: "CloudTrail and GuardDuty feed central security telemetry.",
    icon: "Activity",
    color: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "automation",
    name: "Auto Remediation",
    description: "Event-driven Lambda actions auto-fix policy violations.",
    icon: "Cpu",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
];

export default function ArchitecturePage() {
  const [archData, setArchData] = useState<ArchitectureData | null>(null);

  useEffect(() => {
    const fetchArch = async () => {
      try {
        const res = await fetch(`${API_BASE}/architecture`);
        if (res.ok) {
          setArchData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch architecture data:", error);
      }
    };
    fetchArch();
  }, []);

  if (!archData) {
    return <div className="p-6">Loading...</div>;
  }

  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Layout,
    Key,
    Shield,
    Activity,
    Cpu,
  };

  const components = archData.components.map(comp => ({
    ...comp,
    icon: iconMap[comp.icon] || Layout,
  }));

  const getComponent = (index: number) => {
    if (components[index]) return components[index];
    const fallback = DEFAULT_COMPONENTS[index] ?? DEFAULT_COMPONENTS[0];
    return {
      ...fallback,
      icon: iconMap[fallback.icon] || Layout,
    };
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Landing Zone Architecture</h1>
          <p className="text-zinc-400">Visual representation of the secure cloud infrastructure and guardrails.</p>
        </div>
      </div>

      <div className="relative glass-card rounded-3xl p-12 min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        
        {/* Connection Lines (SVGs) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="white" strokeWidth="2" strokeDasharray="8 8" />
          <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="white" strokeWidth="2" strokeDasharray="8 8" />
          <circle cx="50%" cy="50%" r="4" fill="white" />
        </svg>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 w-full">
          {/* Top Row */}
          <div className="col-start-2 flex justify-center">
            <ArchCard {...getComponent(0)} />
          </div>

          {/* Middle Row */}
          <div className="flex justify-center">
            <ArchCard {...getComponent(1)} />
          </div>
          <div className="flex justify-center">
            <div className="w-48 h-48 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center relative group">
              <div className="absolute inset-0 rounded-full bg-indigo-500/5 animate-pulse"></div>
              <div className="text-center">
                <Shield className="w-12 h-12 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Core Security</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <ArchCard {...getComponent(2)} />
          </div>

          {/* Bottom Row */}
          <div className="col-start-1 flex justify-center">
            <ArchCard {...getComponent(3)} />
          </div>
          <div className="col-start-3 flex justify-center">
            <ArchCard {...getComponent(4)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            Control Flow
          </h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-[10px] text-white">1</span>
              <span>Events are captured via CloudTrail and GuardDuty in member accounts.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-[10px] text-white">2</span>
              <span>Guardrails (AWS Config) evaluate resources against compliance policies.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-[10px] text-white">3</span>
              <span>Non-compliant resources trigger an EventBridge event for remediation.</span>
            </li>
          </ul>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            Remediation Logic
          </h3>
          <ul className="space-y-3 text-sm text-zinc-400">
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-[10px] text-white">4</span>
              <span>Lambda functions execute predefined remediation actions (e.g., closing ports).</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-[10px] text-white">5</span>
              <span>Logs are aggregated in the Central Log Archive for auditing.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-[10px] text-white">6</span>
              <span>Security Score is recalculated in real-time based on posture.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ArchCard({ name, description, icon: Icon, color }: ArchCardProps) {
  return (
    <div className={`w-48 p-4 rounded-xl border ${color} glass-card transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-default group`}>
      <Icon className="w-8 h-8 mb-3 group-hover:rotate-12 transition-transform" />
      <h4 className="font-bold text-sm mb-1 text-white">{name}</h4>
      <p className="text-[10px] leading-tight text-zinc-400">{description}</p>
    </div>
  );
}
