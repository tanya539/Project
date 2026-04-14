import { NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.BACKEND_API_URL ??
  process.env.API_TARGET ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

const fallbackArchitecture = {
  components: [
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
  ],
  controlFlow: [
    "Detect event in CloudTrail/GuardDuty.",
    "Evaluate controls via Config/SCP policies.",
    "Trigger EventBridge remediation workflow.",
    "Update dashboard posture and compliance view.",
  ],
};

function buildUrl(path: string) {
  const base = BACKEND_BASE_URL.replace(/\/$/, "");
  if (/\/api$/i.test(base)) return `${base}/${path}`;
  return `${base}/api/${path}`;
}

export async function GET() {
  try {
    const response = await fetch(buildUrl("architecture"), { cache: "no-store" });
    if (response.ok) {
      return NextResponse.json(await response.json(), { status: 200 });
    }
  } catch {
    // Fall back to demo-safe data below.
  }

  return NextResponse.json(fallbackArchitecture, { status: 200 });
}
