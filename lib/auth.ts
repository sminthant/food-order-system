import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { createId } from "@/lib/cart";
import { HttpError } from "@/lib/http";
import { connectDB } from "@/lib/mongodb";
import { AccountModel } from "@/models/account";
import { CustomerModel } from "@/models/customer";
import { SessionModel } from "@/models/session";
import type { AccountRole, PublicAccount } from "@/types/account";

const scryptAsync = promisify(scrypt);
export const SESSION_COOKIE = "foodgo_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 32)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = (await scryptAsync(password, salt, 32)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function toPublic(account: { id: string; name: string; email: string; role: string }): PublicAccount {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role === "admin" ? "admin" : "user",
  };
}

export function readRole(value: unknown): AccountRole {
  if (value === "user" || value === "admin") return value;
  throw new HttpError(400, "Choose a customer or admin account.");
}

export function loginFields(body: Record<string, unknown>, requireName: boolean) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (requireName && name.length < 2) throw new HttpError(400, "Enter your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "Enter a valid email.");
  if (password.length < 8) throw new HttpError(400, "Use at least 8 characters.");
  return { name, email, password };
}

export async function getCurrentAccount() {
  await connection();
  await connectDB();
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const session = await SessionModel.findOne({ tokenHash }).lean();
  if (!session || session.expiresAt.getTime() < Date.now()) {
    if (session) await SessionModel.deleteOne({ tokenHash });
    return null;
  }

  const account = await AccountModel.findOne({ id: session.accountId }).lean();
  if (!account) return null;
  return toPublic(account);
}

export async function requireAccount() {
  const account = await getCurrentAccount();
  if (!account) throw new HttpError(401, "Sign in to continue.");
  return account;
}

export async function requireAdmin() {
  const account = await requireAccount();
  if (account.role !== "admin") throw new HttpError(403, "An admin account is required.");
  return account;
}

async function writeSession(accountId: string) {
  const token = randomBytes(32).toString("hex");
  await SessionModel.create({
    tokenHash: hashToken(token),
    accountId,
    expiresAt: new Date(Date.now() + SESSION_SECONDS * 1000),
  });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function registerAccount(input: {
  name: string;
  email: string;
  password: string;
  role: AccountRole;
}) {
  const email = input.email.trim().toLowerCase();
  const existing = await AccountModel.findOne({ email }).lean();
  if (existing) throw new HttpError(400, "An account with this email already exists.");

  const account = await AccountModel.create({
    id: createId("acc"),
    name: input.name.trim(),
    email,
    passwordHash: await hashPassword(input.password),
    role: input.role,
  });

  if (input.role === "user") {
    await CustomerModel.create({
      id: account.id,
      name: account.name,
      email: account.email,
      phone: "Not provided",
      address: "Not provided",
      joinedAt: new Date().toISOString().slice(0, 10),
      orderCount: 0,
    });
  }

  await writeSession(account.id);
  return toPublic(account);
}

export async function loginAccount(email: string, password: string) {
  const account = await AccountModel.findOne({ email: email.trim().toLowerCase() });
  if (!account || !(await verifyPassword(password, account.passwordHash))) {
    throw new HttpError(401, "Email or password is incorrect.");
  }
  await writeSession(account.id);
  return toPublic(account);
}

export async function logoutAccount() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await SessionModel.deleteOne({ tokenHash: hashToken(token) });
  jar.delete(SESSION_COOKIE);
}
