"use client";

import { useState } from "react";
import { Bell, User, ShieldCheck, X, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error";
  timeLabel: string;
}

export default function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="h-14 sticky top-0 z-50 flex items-center justify-between px-6 border-b border-[color:var(--border)] bg-[color:var(--nav)] text-[color:var(--text)] backdrop-blur-xl shadow-[0_12px_40px_-26px_var(--shadow)] theme-transition">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[color:var(--accent)]" />
          <span className="font-bold text-sm tracking-widest text-[color:var(--text)]">SECUREBASE</span>
        </div>
        <div className="h-4 w-px bg-[color:var(--border)]"></div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded uppercase tracking-wider border border-[color:var(--border)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] text-[10px] font-bold">PROD</span>
          <span className="px-2 py-0.5 rounded uppercase tracking-wider border border-[color:var(--border)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] text-[10px] font-bold">aws-ap-south-1</span>
          <span className="px-2 py-0.5 rounded uppercase tracking-wider border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted)] text-[10px] font-bold">LZ v3.2.0</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="rounded-md p-1.5 text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-[color:var(--surface-hover)] transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        <div className="relative">
          <Bell
            className="w-4 h-4 cursor-pointer text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse border-2 border-[color:var(--bg)]"></span>
          )}
          {showNotifications && (
            <div className="absolute right-0 top-8 z-50 w-80 overflow-y-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] shadow-xl">
              <div className="p-3 border-b border-[color:var(--border)]">
                <h3 className="text-sm font-semibold text-[color:var(--text)]">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-[color:var(--muted)] text-sm">No new notifications</div>
              ) : (
                notifications.map(notification => (
                  <div key={notification.id} className="border-b border-[color:var(--border)] p-3 transition-colors hover:bg-[color:var(--surface-hover)]">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-[color:var(--text)]">{notification.title}</h4>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">{notification.message}</p>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">{notification.timeLabel}</p>
                      </div>
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="text-[color:var(--muted)] hover:text-[color:var(--text)]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--muted)] transition-colors hover:bg-[color:var(--surface-hover)] hover:text-[color:var(--text)]">
          <User className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
