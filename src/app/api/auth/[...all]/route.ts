import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createSession, destroySession, getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.pathname.split("/").pop();

  try {
    const body = await req.json();

    if (action === "login") {
      const { email, password } = body;
      const user = await verifyCredentials(email, password);
      if (!user) {
        return NextResponse.json(
          { success: false, message: "Email atau password salah" },
          { status: 401 }
        );
      }
      await createSession(user.id);
      return NextResponse.json({
        success: true,
        data: { id: user.id, name: user.name, role: user.role },
      });
    }

    if (action === "logout") {
      await destroySession();
      return NextResponse.json({ success: true, data: null });
    }

    return NextResponse.json(
      { success: false, message: "Unknown action" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { success: false, data: null },
      { status: 401 }
    );
  }
  return NextResponse.json({ success: true, data: session.user });
}
