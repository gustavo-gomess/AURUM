import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
    if (request.nextUrl.pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Access Denied: Admins only" }, { status: 403 });
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url)); 
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};


