"use client";

import { useEffect, useState } from "react";
import { FileCheck, Shield } from "lucide-react";

interface Framework {
  name: string;
  status: string;
  controlsPassed: number;
  controlsTotal: number;
  color: string;
  bg: string;
  border: string;
}

export default function CompliancePage() {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);

  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const res = await fetch('/api/compliance');
        if (res.ok) {
          setFrameworks(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch compliance data:", error);
      }
    };
    fetchFrameworks();
  }, []);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-700 max-w-[1800px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-card p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Compliance Frameworks</h1>
          <p className="text-slate-500 text-xs font-medium">Automated compliance mapping and auditing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {frameworks.map((fw, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:border-sky-200 transition-all shadow-sm hover:shadow-md">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl ${fw.bg} border ${fw.border}`}>
                  <FileCheck className={`w-6 h-6 ${fw.color}`} />
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${fw.bg} ${fw.color} ${fw.border}`}>
                  {fw.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{fw.name}</h3>
              
              {fw.controlsTotal > 0 ? (
                <div className="space-y-2 mt-6">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Controls Passed</span>
                    <span className="font-mono">{fw.controlsPassed} / {fw.controlsTotal}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full ${fw.controlsPassed === fw.controlsTotal ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${(fw.controlsPassed / fw.controlsTotal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
                  <Shield className="w-4 h-4" />
                  Assessment pending...
                </div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button className="text-xs font-bold text-sky-600 hover:text-sky-700">View Detailed Report →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
