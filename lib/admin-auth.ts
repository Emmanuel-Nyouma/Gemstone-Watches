import "server-only";

import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "gemstone_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

type AdminSession = { email: string; expiresAt: number };

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 32);
}

function derivePassword(password: string, salt: Buffer, iterations: number) {
  return pbkdf2Sync(password, salt, iterations, 32, "sha256");
}

export function createPasswordHash(password: string) {
  const iterations = 310_000;
  const salt = randomBytes(16);
  const hash = derivePassword(password, salt, iterations);
  return `${iterations}:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyAdminPassword(password: string) {
  const encoded = process.env.ADMIN_PASSWORD_HASH;
  if (!encoded) return false;
  const [iterationsText, saltHex, hashHex] = encoded.split(":");
  const iterations = Number(iterationsText);
  if (!iterations || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = derivePassword(password, Buffer.from(saltHex, "hex"), iterations);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(payload).digest("base64url");
}

function createSessionValue(email: string) {
  const payload = encode(JSON.stringify({ email, expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000 } satisfies AdminSession));
  return `${payload}.${sign(payload)}`;
}

function verifySessionValue(value: string | undefined): AdminSession | null {
  if (!value || !isAdminConfigured()) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const session = JSON.parse(decode(payload)) as AdminSession;
    if (session.email.toLowerCase() !== process.env.ADMIN_EMAIL!.toLowerCase() || session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifySessionValue(cookieStore.get(COOKIE_NAME)?.value);
}

export async function startAdminSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionValue(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function endAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function requireAdmin() {
  if (!isAdminConfigured()) redirect("/admin/login?setup=1");
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
