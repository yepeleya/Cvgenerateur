import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes qui nécessitent une authentification
const protectedRoutes = ['/', '/my-cvs', '/profile']

// Routes publiques (pas besoin d'authentification)
const publicRoutes = ['/auth/login', '/auth/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  // Rediriger vers la page de connexion si pas de token sur route protégée
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Rediriger vers la page d'accueil si déjà connecté et sur une page publique
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Matches all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
