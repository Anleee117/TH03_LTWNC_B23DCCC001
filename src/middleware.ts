import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { can } from './lib/permissions';
import { UserRole } from './types';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || 'ptit_class_deadline_hub_super_secret_key_2026_jwt'
  });

  const isAuth = !!token;
  const role = (token?.role as UserRole) || null;

  if (pathname.startsWith('/dashboard')) {
    if (!isAuth) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    if (!isAuth) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }

    if (!can(role, 'create')) {
      const forbiddenUrl = new URL('/403', req.url);
      return NextResponse.redirect(forbiddenUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
