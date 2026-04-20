import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/projects', '/settings']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))

  const authCookie = request.cookies.get('pb_auth')?.value

  // Rediriger vers /login si route protégée et non authentifié
  if (isProtected && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Rediriger vers /projects si déjà connecté et sur /login
  if (pathname === '/login' && authCookie) {
    return NextResponse.redirect(new URL('/projects', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/projects/:path*', '/settings/:path*', '/login'],
}
