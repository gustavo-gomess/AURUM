import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Para páginas admin, permitir acesso
  // A verificação de autenticação será feita no lado do cliente
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Para APIs admin, também permitir acesso
  // A verificação de token será feita dentro de cada API
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};


