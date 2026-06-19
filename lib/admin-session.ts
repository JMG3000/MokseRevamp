import { getIronSession, type IronSession, type SessionOptions } from "iron-session";
import bcrypt from "bcryptjs";
import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "mokse_admin_session";
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

export type AdminUser = {
  username: string;
  authenticatedAt: string;
};

export type AdminSessionData = {
  user?: AdminUser;
};

type AuthResult =
  | { ok: true; user: AdminUser }
  | { ok: false; error: "missing-config" | "invalid-credentials" };

const getSessionSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
};

const getSessionOptions = (password: string): SessionOptions => ({
  cookieName: ADMIN_COOKIE_NAME,
  password,
  ttl: ADMIN_SESSION_TTL_SECONDS,
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
});

const getConfiguredAdmin = () => {
  const username = process.env.ADMIN_USERNAME?.trim();
  const passwordHash = process.env.ADMIN_PASSWORD_BCRYPT?.trim();

  if (!username || !passwordHash || !/^\$2[aby]\$/.test(passwordHash)) {
    return null;
  }

  return { username, passwordHash };
};

const constantTimeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  const maxLength = Math.max(leftBuffer.length, rightBuffer.length);
  const paddedLeft = Buffer.alloc(maxLength);
  const paddedRight = Buffer.alloc(maxLength);

  leftBuffer.copy(paddedLeft);
  rightBuffer.copy(paddedRight);

  const lengthsMatch = leftBuffer.length === rightBuffer.length;
  const contentsMatch = timingSafeEqual(paddedLeft, paddedRight);

  return lengthsMatch && contentsMatch;
};

export async function getAdminSession(): Promise<IronSession<AdminSessionData> | null> {
  const secret = getSessionSecret();

  if (!secret) {
    return null;
  }

  return getIronSession<AdminSessionData>(
    await cookies(),
    getSessionOptions(secret),
  );
}

export async function getAdminUser() {
  const session = await getAdminSession();
  return session?.user ?? null;
}

export async function authenticateAdmin(
  username: string,
  password: string,
): Promise<AuthResult> {
  const configuredAdmin = getConfiguredAdmin();

  if (!configuredAdmin || !getSessionSecret()) {
    return { ok: false, error: "missing-config" };
  }

  const usernameMatches = constantTimeEqual(username.trim(), configuredAdmin.username);
  const passwordMatches = await bcrypt.compare(password, configuredAdmin.passwordHash);

  if (!usernameMatches || !passwordMatches) {
    return { ok: false, error: "invalid-credentials" };
  }

  return {
    ok: true,
    user: {
      username: configuredAdmin.username,
      authenticatedAt: new Date().toISOString(),
    },
  };
}

export async function saveAdminUser(user: AdminUser) {
  const session = await getAdminSession();

  if (!session) {
    return false;
  }

  session.user = user;
  await session.save();
  return true;
}

export async function clearAdminSession() {
  const session = await getAdminSession();
  await session?.destroy();
}
