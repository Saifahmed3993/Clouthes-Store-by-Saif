import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("clouthes.refresh")?.value;
  
  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  
  try {
    const response = await fetch(`${apiUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      cookieStore.delete("clouthes.refresh");
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
    }

    const data = await response.json();
    
    const responseData = NextResponse.json(data);
    
    // Update the cookie securely
    responseData.cookies.set("clouthes.refresh", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60
    });

    return responseData;
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
