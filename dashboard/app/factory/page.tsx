"use client";

import { FormEvent, useMemo, useState } from "react";
import { Factory, Plus, History, CheckCircle, X } from "lucide-react";

type RequestStatus = "Provisioned" | "In Progress" | "Pending Approval";

interface ProvisionRequest {
  id: string;
  accountName: string;
  ou: string;
  status: RequestStatus;
  createdAt: string;
}

const seedRequests: ProvisionRequest[] = [
  { id: "REQ-001", accountName: "data-science-prod", ou: "Workloads", status: "Provisioned", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "REQ-002", accountName: "marketing-sandbox", ou: "Sandbox", status: "In Progress", createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
  { id: "REQ-003", accountName: "finance-audit", ou: "Security", status: "Pending Approval", createdAt: new Date().toISOString() },
];

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function AccountFactoryPage() {
  const [requests, setRequests] = useState<ProvisionRequest[]>(seedRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [targetOu, setTargetOu] = useState("Workloads");
  const [banner, setBanner] = useState<string | null>(null);

  const nextId = useMemo(() => {
    const maxId = requests.reduce((max, req) => {
      const n = Number(req.id.replace("REQ-", ""));
      return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 0);
    return `REQ-${String(maxId + 1).padStart(3, "0")}`;
  }, [requests]);

  const closeModal = () => {
    setIsModalOpen(false);
    setAccountName("");
    setTargetOu("Workloads");
  };

  const vendNewAccount = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = accountName.trim().toLowerCase().replace(/\s+/g, "-");
    if (!trimmedName) return;

    const newRequest: ProvisionRequest = {
      id: nextId,
      accountName: trimmedName,
      ou: targetOu,
      status: "Pending Approval",
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    setBanner(`Request ${newRequest.id} created for ${newRequest.accountName}.`);
    closeModal();
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-700 max-w-[1800px] mx-auto">
      {banner ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
          {banner}
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-card p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Account Factory</h1>
          <p className="text-slate-500 text-xs font-medium">Standardized AWS account provisioning and vending.</p>
        </div>
        <button
          onClick={() => {
            setBanner(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Vend New Account
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-2xl">
            <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Factory className="w-4 h-4 text-sky-500" />
              Account Baselines
            </h2>
            <div className="space-y-4">
              {['Standard Workload', 'Security Tooling', 'Developer Sandbox'].map((baseline, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">{baseline}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Pre-configured VPC, IAM, CloudTrail</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden h-full">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2 bg-slate-50/50">
              <History className="w-4 h-4 text-blue-500" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Provisioning Requests</h2>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase">Request ID</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase">Account Name</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase">Target OU</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-slate-500">{req.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{req.accountName}</td>
                    <td className="py-3 px-4 text-slate-600">{req.ou}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        req.status === 'Provisioned' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        req.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                        'bg-amber-50 text-amber-600 border-amber-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">{formatRelativeTime(req.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Vend New Account</h3>
              <button
                onClick={closeModal}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={vendNewAccount} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Account Name</label>
                <input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. analytics-prod"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-500 focus:ring-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">Target OU</label>
                <select
                  value={targetOu}
                  onChange={(e) => setTargetOu(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-500 focus:ring-2"
                >
                  <option value="Workloads">Workloads</option>
                  <option value="Sandbox">Sandbox</option>
                  <option value="Security">Security</option>
                  <option value="SharedServices">SharedServices</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-700"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}