import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn');
  const isLoggedInFlag: boolean = isLoggedIn?.value == 'true';
  if (!isLoggedInFlag && !String(request.url).includes('/login'))
    return NextResponse.redirect(new URL('/login', request.url));
  if (isLoggedInFlag && String(request.url).includes('/login'))
    return NextResponse.redirect(new URL('/', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!.*\\.).*)',
};
