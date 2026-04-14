import { NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.BACKEND_API_URL ??
  process.env.API_TARGET ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

const fallbackGuardrails = {
  scps: [
    {
      name: "DENY-ROOT-ACCESS",
      description: "Blocks root account API activity across member accounts.",
    },
    {
      name: "DENY-S3-PUBLIC-ACL",
      description: "Prevents public ACLs on S3 buckets.",
    },
    {
      name: "DENY-UNENCRYPTED-EBS",
      description: "Prevents launch of unencrypted EBS volumes.",
    },
  ],
  configRules: [
    { name: "S3_BUCKET_SSL_REQUESTS_ONLY", status: "COMPLIANT" },
    { name: "CLOUDTRAIL_ENABLED", status: "COMPLIANT" },
    { name: "INCOMING_SSH_DISABLED", status: "NON_COMPLIANT" },
  ],
};

function buildUrl(path: string) {
  const base = BACKEND_BASE_URL.replace(/\/$/, "");
  if (/\/api$/i.test(base)) return `${base}/${path}`;
  return `${base}/api/${path}`;
}

export async function GET() {
  try {
    const response = await fetch(buildUrl("guardrails"), { cache: "no-store" });
    if (response.ok) {
      return NextResponse.json(await response.json(), { status: 200 });
    }
  } catch {
    // Fall back to demo-safe data below.
  }

  return NextResponse.json(fallbackGuardrails, { status: 200 });
}
