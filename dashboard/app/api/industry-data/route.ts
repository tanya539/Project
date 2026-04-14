import { NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.BACKEND_API_URL ??
  process.env.API_TARGET ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

async function proxyToBackend(method: "GET" | "POST", body?: unknown) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/industry-data`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method === "POST" ? JSON.stringify(body ?? {}) : undefined,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : { success: response.ok, message: await response.text() };

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message:
          "Backend API is unreachable. Set BACKEND_API_URL in dashboard environment settings.",
      },
      { status: 502 }
    );
  }
}

export async function GET() {
  return proxyToBackend("GET");
}

export async function POST(req: Request) {
  const body = await req.json();
  return proxyToBackend("POST", body);
}
