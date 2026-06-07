import { NextResponse } from "next/server";
import { getSession } from "./auth";

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
