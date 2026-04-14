"use client";

import { useEffect, useState } from "react";
import { Shield, Play, Download, Server } from "lucide-react";
import AttackButton from "@/components/AttackButton";
import LogsPanel from "@/components/LogsPanel";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAccounts: 0,
    activeResources: 0,
    securityScore: 0,
    activeViolations: 0,
    compliancePercentage: 0,
    frameworksActive: 0,
    lastScan: "",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/stats`);
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  const handleRunAssessment = () => {
    toast.success("Security assessment started", {
      description: `Evaluating ${stats.activeResources} resources across ${stats.totalAccounts} accounts.`,
    });
  };

  const handleExportReport = () => {
    toast.success("Report export started", {
      description: "Your dashboard summary is being generated.",
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-950/95 p-6 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.7)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800 text-sky-300">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">SecureBase</p>
                <h1 className="text-3xl font-semibold text-white">Security posture overview</h1>
              </div>
            </div>
            <p className="max-w-2xl text-sm text-slate-400">
              Last evaluated · {stats.lastScan ? new Date(stats.lastScan).toLocaleString() : "pending"} · {stats.activeResources} resources across {stats.totalAccounts} accounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleRunAssessment} className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              <Play className="mr-2 inline-block h-4 w-4" /> Run Assessment
            </button>
            <button onClick={handleExportReport} className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-900">
              <Download className="mr-2 inline-block h-4 w-4 text-slate-300" /> Export Report
            </button>
            <div className="w-full sm:w-auto">
              <AttackButton />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        {[
          { label: "Security Score", value: `${stats.securityScore}%`, detail: "+2%", color: "text-emerald-500", bg: "bg-emerald-50/10" },
          { label: "Resources Protected", value: stats.activeResources, detail: "+12", color: "text-sky-400", bg: "bg-sky-50/10" },
          { label: "Open Findings", value: stats.activeViolations, detail: "-1", color: "text-rose-500", bg: "bg-rose-50/10" },
          { label: "Guardrail Coverage", value: `${stats.compliancePercentage}%`, detail: "0%", color: "text-violet-400", bg: "bg-violet-50/10" },
          { label: "Frameworks Active", value: stats.frameworksActive, detail: "0", color: "text-amber-400", bg: "bg-amber-50/10" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-3xl border border-slate-800 ${stat.bg} p-5`}>
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</div>
            <div className="mt-4 flex items-end gap-3">
              <span className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</span>
              <span className="text-sm text-slate-400">{stat.detail}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-5 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.7)]">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2 text-slate-100">
                <Shield className="h-4 w-4 text-sky-400" />
                <span className="text-sm font-semibold uppercase tracking-[0.3em]">Continuous Security Guardrails</span>
              </div>
              <button className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-400 hover:text-sky-300">View all policies</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: "Encryption at Rest", value: 100, status: "ok" },
                { name: "Encryption in Transit", value: 100, status: "ok" },
                { name: "MFA Enforcement", value: 98, status: "warn" },
                { name: "Network Segmentation", value: 100, status: "ok" },
                { name: "Config & Audit Logging", value: 100, status: "ok" },
                { name: "Least Privilege IAM", value: 85, status: "alert" },
                { name: "Threat Detection", value: 100, status: "ok" },
                { name: "Backup & Recovery", value: 95, status: "warn" },
              ].map((item) => (
                <div key={item.name} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-100">
                    <span>{item.name}</span>
                    <span className={item.status === "ok" ? "text-emerald-400" : item.status === "warn" ? "text-amber-400" : "text-rose-400"}>{item.value}%</span>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full rounded-full ${item.status === "ok" ? "bg-emerald-500" : item.status === "warn" ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Compliance</p>
                  <h2 className="text-lg font-semibold text-white">Framework posture</h2>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-300">Healthy</span>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                {[
                  { label: "CIS AWS v3.0", value: "43/43", status: "Compliant" },
                  { label: "NIST 800-53", value: "112/115", status: "3 Findings" },
                  { label: "SOC 2 Type II", value: "64/64", status: "Compliant" },
                ].map((row) => (
                  <div key={row.label} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                    <div className="flex items-center justify-between">
                      <span>{row.label}</span>
                      <span className={row.status.includes("Compliant") ? "text-emerald-300" : "text-amber-300"}>{row.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Policies</p>
                  <h2 className="text-lg font-semibold text-white">Service control insights</h2>
                </div>
                <span className="rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-sky-300">Enforced</span>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                {[
                  "Deny root account usage org-wide",
                  "Restrict to approved AWS regions",
                  "Deny disabling CloudTrail",
                  "Require VPC for EC2 instances",
                ].map((text) => (
                  <div key={text} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">{text}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 text-slate-100">
                <Server className="h-4 w-4 text-sky-400" />
                <span className="text-sm font-semibold uppercase tracking-[0.3em]">Landing Zone Topology</span>
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Live Map</span>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
              <div className="grid gap-3">
                <div className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">ORG ROOT</div>
                <div className="grid gap-3">
                  <div className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs uppercase tracking-[0.25em] text-sky-300">Mgmt OU</div>
                  <div className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs uppercase tracking-[0.25em] text-emerald-300">Security OU</div>
                  <div className="rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs uppercase tracking-[0.25em] text-violet-300">Workloads OU</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Live audit events</p>
                <h2 className="text-lg font-semibold text-white">Audit timeline</h2>
              </div>
              <button className="rounded-full bg-slate-900 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-slate-300">View all</button>
            </div>
            <LogsPanel />
          </div>
        </div>
      </section>
    </div>
  );
}
