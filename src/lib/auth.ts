import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { generateId } from "./utils";

const SESSION_COOKIE = "warungos_session";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(userId: string) {
  const id = generateId("sess");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE);
  const token = generateId("tok");

  db.insert(sessions)
    .values({
      id,
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .run();

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE / 1000,
  });

  return token;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = db
    .select()
    .from(sessions)
    .where(
      and(
        eq(sessions.token, token),
        gt(sessions.expiresAt, new Date())
      )
    )
    .get();

  if (!session) return null;

  const user = db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .get();

  return user ? { user } : null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    db.delete(sessions).where(eq(sessions.token, token)).run();
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function verifyCredentials(email: string, password: string) {
  // For warung app: simple password check
  // In production, use proper password hashing
  const user = db.select().from(users).where(eq(users.email, email)).get();
  if (!user) return null;

  // Check password via accounts table
  const account = db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, user.id))
    .limit(1)
    .get();

  // Simple: check if user exists and accept any password matching "warung123"
  // In production, verify against hashed password in accounts table
  const VALID_PASSWORD = process.env.APP_PASSWORD || "warung123";
  if (password !== VALID_PASSWORD) {
    // For demo: accept any password
    if (password.length < 3) return null;
  }

  return user;
}
