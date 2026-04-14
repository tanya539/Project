import { NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.BACKEND_API_URL ??
  process.env.API_TARGET ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

function normalizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

function getCandidateUrls(method: "GET" | "POST") {
  const base = normalizeBaseUrl(BACKEND_BASE_URL);
  const looksLikeApiBase = /\/api$/i.test(base);

  const candidates = new Set<string>();

  if (looksLikeApiBase) {
    candidates.add(`${base}/industry-data`);
  } else {
    candidates.add(`${base}/api/industry-data`);
  }

  if (method === "POST") {
    candidates.add(`${base}/analyze`);
  }

  return Array.from(candidates);
}

async function proxyToBackend(method: "GET" | "POST", body?: unknown) {
  try {
    const urls = getCandidateUrls(method);
    let lastStatus = 502;
    let lastPayload: unknown = {
      success: false,
      message: "Backend did not return a valid response.",
    };

    for (const url of urls) {
      const response = await fetch(url, {
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

      if (response.ok) {
        return NextResponse.json(payload, { status: response.status });
      }

      lastStatus = response.status;
      lastPayload = payload;

      // Try the next candidate when endpoint is missing on this backend version.
      const missingRoute =
        response.status === 404 ||
        (typeof payload === "object" &&
          payload !== null &&
          "message" in payload &&
          typeof (payload as { message?: unknown }).message === "string" &&
          /Cannot\s+(GET|POST)/i.test((payload as { message: string }).message));

      if (!missingRoute) {
        break;
      }
    }

    return NextResponse.json(lastPayload, { status: lastStatus });
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
