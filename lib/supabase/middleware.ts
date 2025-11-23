import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // 1. Buat Response Awal
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // A. Update Request Cookies (Agar Server Component bisa baca)
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );

          // B. Buat ulang response agar membawa cookie baru
          response = NextResponse.next({
            request,
          });

          // C. Update Response Cookies (Agar Browser menyimpan)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 2. Cek User saat ini (Ini sekaligus me-refresh token jika expired)
  // PENTING: Jangan gunakan destructuring { data: { user } } langsung jika ingin aman dari error
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. ATURAN REDIRECT (PROTEKSI HALAMAN)
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // A. PROTEKSI ROUTE DASHBOARD & PRIVAT
  // Daftar halaman yang WAJIB login
  const protectedPaths = [
    "/dashboard",
    "/documents",
    "/settings",
    "/favorites",
    "/update-password",
  ];

  // Cek apakah user mengakses halaman yang diproteksi
  const isProtectedRoute = protectedPaths.some((prefix) =>
    path.startsWith(prefix)
  );

  if (isProtectedRoute && !user) {
    // Jika belum login, tendang ke halaman login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // B. PROTEKSI ROUTE AUTH (Login/Register)
  // Jika user SUDAH login, jangan biarkan masuk ke halaman login lagi
  const authPaths = ["/login", "/register", "/forgot-password"];

  if (authPaths.includes(path) && user) {
    // Jika sudah login, lempar ke dashboard
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 4. Kembalikan response yang sudah membawa cookie baru
  return response;
}
