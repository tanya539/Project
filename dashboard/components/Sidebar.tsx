"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Shield,
  FileCheck,
  Factory,
  Layers,
  FileLock,
  Network,
  Activity,
  Target,
  Database,
  Key,
  Tags,
  Settings,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Security Posture", href: "/posture", icon: ShieldCheck },
    { name: "Guardrails", href: "/guardrails", icon: Shield },
    { name: "Compliance", href: "/compliance", icon: FileCheck },
    { name: "Account Factory", href: "/factory", icon: Factory },
    { name: "OUs & Accounts", href: "/ous", icon: Layers },
    { name: "SCPs & Policies", href: "/scps", icon: FileLock },
    { name: "Networking", href: "/networking", icon: Network },
    { name: "Audit Trail", href: "/logs", icon: Activity },
    { name: "Threat Detection", href: "/violations", icon: Target, badge: "Live" },
    { name: "SIEM Integration", href: "/siem", icon: Database },
    { name: "IAM & Access", href: "/iam", icon: Key },
    { name: "Industry Data", href: "/data", icon: Upload },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-5 lg:flex lg:flex-col theme-transition">
      <div className="mb-6 flex items-center gap-3 rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface-strong)] p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">SC</div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Secure Cloud</p>
          <p className="text-sm font-semibold text-[color:var(--text)]">Landing Zone</p>
        </div>
      </div>
      <nav className="space-y-1 overflow-y-auto pr-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (pathname === "/" && link.href === "/dashboard");

          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-3xl px-4 py-3 text-sm transition-colors duration-200",
                isActive
                  ? "bg-[color:var(--surface-strong)] text-[color:var(--text)] shadow-sm shadow-[rgba(96,165,250,0.12)]"
                  : "text-[color:var(--muted)] hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--text)]"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-[color:var(--accent)]" : "text-[color:var(--muted)]")} />
              <span>{link.name}</span>
              {link.badge && <span className="ml-auto rounded-full bg-[color:var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--accent-strong)]">{link.badge}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

