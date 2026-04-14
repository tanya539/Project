import { NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.BACKEND_API_URL ??
  process.env.API_TARGET ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

const fallbackPosture = {
  score: 82,
  trend: "+2%",
  lastUpdated: new Date().toISOString(),
  categories: [
    { name: "Encryption at Rest", score: 90, status: "Excellent" },
    { name: "Network Security", score: 81, status: "Good" },
    { name: "Access Management", score: 74, status: "Needs Attention" },
    { name: "Monitoring & Logging", score: 85, status: "Good" },
    { name: "Compliance", score: 79, status: "Good" },
  ],
};

function buildUrl(path: string) {
  const base = BACKEND_BASE_URL.replace(/\/$/, "");
  if (/\/api$/i.test(base)) return `${base}/${path}`;
  return `${base}/api/${path}`;
}

export async function GET() {
  try {
    const response = await fetch(buildUrl("posture"), { cache: "no-store" });
    if (response.ok) {
      return NextResponse.json(await response.json(), { status: 200 });
    }
  } catch {
    // Fall back to demo-safe data below.
  }

  return NextResponse.json(fallbackPosture, { status: 200 });
}
