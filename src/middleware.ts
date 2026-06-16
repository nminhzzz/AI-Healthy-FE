import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các đường dẫn yêu cầu đăng nhập
const protectedRoutes = ['/profile', '/orders', '/admin'];
// Các đường dẫn dành riêng cho khách (đã đăng nhập thì không vào được nữa)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Kiểm tra xem trình duyệt có gửi cookie refresh_token lên không
  const hasToken = request.cookies.has('refresh_token');

  // 1. Chặn người dùng chưa đăng nhập truy cập trang bảo mật
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  if (isProtectedRoute && !hasToken) {
    // Chuyển hướng về trang login, kèm theo ?callbackUrl để sau khi login xong quay lại trang cũ
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // 2. Chặn người dùng ĐÃ đăng nhập truy cập lại trang Login / Register
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Cho phép đi tiếp
  return NextResponse.next();
}

// Chỉ chạy middleware trên những route cần thiết để tối ưu hiệu suất
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
