import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();
    if (!refreshToken) return NextResponse.json({ success: false }, { status: 400 });

    const response = NextResponse.json({ success: true });
    response.cookies.set("clouthes.refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("clouthes.refresh");
  return NextResponse.json({ success: true });
}
