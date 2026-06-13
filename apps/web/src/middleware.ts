import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const response = NextResponse.next()
  console.log(request.nextUrl.pathname)

  if (pathname.startsWith('/org')) {
    const [, , slug] = pathname.split('/')

    response.cookies.set('org', slug)
  } else if (
    pathname === '/.well-known/appspecific/com.chrome.devtools.json' ||
    pathname === '/favicon.ico'
  ) {
    return response
  } else {
    response.cookies.delete('org')
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.icon).*)'],
}
