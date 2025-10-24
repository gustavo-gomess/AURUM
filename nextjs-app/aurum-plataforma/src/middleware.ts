import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  // Para páginas admin, não verificar no middleware
  // A verificação será feita no lado do cliente (página)
  // Middleware apenas para rotas de API
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  // Para APIs admin, verificar token
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "aurum-jwt-secret-muito-seguro-para-desenvolvimento-local");
    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Access Denied: Admins only" }, { status: 403 });
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};


