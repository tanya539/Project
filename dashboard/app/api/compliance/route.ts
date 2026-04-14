import { NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.BACKEND_API_URL ??
  process.env.API_TARGET ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

const fallbackCompliance = [
  {
    name: "PCI DSS",
    status: "Compliant",
    controlsPassed: 86,
    controlsTotal: 100,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    name: "NIST",
    status: "Compliant",
    controlsPassed: 89,
    controlsTotal: 100,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    name: "GDPR",
    status: "Action Required",
    controlsPassed: 71,
    controlsTotal: 100,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
];

function buildUrl(path: string) {
  const base = BACKEND_BASE_URL.replace(/\/$/, "");
  if (/\/api$/i.test(base)) return `${base}/${path}`;
  return `${base}/api/${path}`;
}

export async function GET() {
  try {
    const response = await fetch(buildUrl("compliance"), { cache: "no-store" });
    if (response.ok) {
      return NextResponse.json(await response.json(), { status: 200 });
    }
  } catch {
    // Fall back to demo-safe data below.
  }

  return NextResponse.json(fallbackCompliance, { status: 200 });
}
