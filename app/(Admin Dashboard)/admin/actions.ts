"use server";

import {
  authenticateAdmin,
  clearAdminSession,
  getAdminUser,
  saveAdminUser,
} from "@/lib/admin-session";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const ADMIN_LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 5;
const ADMIN_LOGIN_RATE_LIMIT_CLEANUP_THRESHOLD = 500;
const ADMIN_LOGIN_RATE_LIMIT_MAX_CLEANUP_ITERATIONS = 100;

type AdminLoginRateLimitEntry = {
  count: number;
  resetAt: number;
};

const adminLoginRateLimits =
  (globalThis as typeof globalThis & {
    __mokseAdminLoginRateLimits?: Map<string, AdminLoginRateLimitEntry>;
  }).__mokseAdminLoginRateLimits ?? new Map<string, AdminLoginRateLimitEntry>();

// This per-process limiter is acceptable for the low-volume admin surface.
// Multi-instance deployments multiply the limit by instance count; use Redis,
// Upstash, or Vercel Firewall if strict global enforcement is required.
(globalThis as typeof globalThis & {
  __mokseAdminLoginRateLimits?: Map<string, AdminLoginRateLimitEntry>;
}).__mokseAdminLoginRateLimits = adminLoginRateLimits;

const getAuditContext = async () => {
  const requestHeaders = await headers();

  return {
    ip:
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      "unknown",
    userAgent: requestHeaders.get("user-agent") ?? "unknown",
    timestamp: new Date().toISOString(),
  };
};

const checkAdminLoginRateLimit = (ip: string, username: string) => {
  const now = Date.now();
  const key = `${ip}:${username.trim().toLowerCase()}`;

  if (adminLoginRateLimits.size > ADMIN_LOGIN_RATE_LIMIT_CLEANUP_THRESHOLD) {
    let checked = 0;

    for (const [entryKey, entry] of adminLoginRateLimits.entries()) {
      if (checked >= ADMIN_LOGIN_RATE_LIMIT_MAX_CLEANUP_ITERATIONS) {
        break;
      }

      checked += 1;

      if (entry.resetAt <= now) {
        adminLoginRateLimits.delete(entryKey);
      }
    }
  }

  const current = adminLoginRateLimits.get(key);

  if (!current || current.resetAt <= now) {
    adminLoginRateLimits.set(key, {
      count: 1,
      resetAt: now + ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (current.count >= ADMIN_LOGIN_RATE_LIMIT_MAX_ATTEMPTS) {
    return true;
  }

  current.count += 1;
  return false;
};

const clearAdminLoginRateLimit = (ip: string, username: string) => {
  adminLoginRateLimits.delete(`${ip}:${username.trim().toLowerCase()}`);
};

export async function loginAdmin(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const auditContext = await getAuditContext();

  if (checkAdminLoginRateLimit(auditContext.ip, username)) {
    console.warn("Admin authentication rate limited", {
      ...auditContext,
      username,
      outcome: "rate-limited",
    });

    redirect("/admin?auth=rate-limited");
  }

  const authResult = await authenticateAdmin(username, password);

  if (!authResult.ok) {
    console.warn("Admin authentication failed", {
      ...auditContext,
      username,
      outcome: authResult.error,
    });

    const reason =
      authResult.error === "missing-config" ? "missing-config" : "invalid";
    redirect(`/admin?auth=${reason}`);
  }

  const saved = await saveAdminUser(authResult.user);

  if (!saved) {
    console.warn("Admin authentication failed", {
      ...auditContext,
      username: authResult.user.username,
      outcome: "session-save-failed",
    });

    redirect("/admin?auth=missing-config");
  }

  clearAdminLoginRateLimit(auditContext.ip, authResult.user.username);

  console.info("Admin authentication succeeded", {
    ...auditContext,
    username: authResult.user.username,
    outcome: "success",
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const user = await getAdminUser();
  const auditContext = await getAuditContext();

  await clearAdminSession();

  console.info("Admin session cleared", {
    ...auditContext,
    username: user?.username ?? "unknown",
    outcome: "signed-out",
  });

  redirect("/admin?auth=signed-out");
}
