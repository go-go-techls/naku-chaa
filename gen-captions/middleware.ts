import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

// ミドルウェアはすべてのリクエストに対して実行される
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // パブリックなパス（認証不要）
  const publicPaths = [
    '/login',
    '/api/auth/login',
    '/api/auth/logout'
  ];
  
  // /registerパスの場合はBasic認証をチェック
  if (pathname === '/register' || pathname.startsWith('/api/auth/register')) {
    const basicAuth = req.headers.get("authorization");

    // 認証ヘッダーが存在しない場合、認証を要求
    if (!basicAuth) {
      return new Response("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"',
        },
      });
    }

    // 環境変数からユーザー名とパスワードを取得
    const user = process.env.BASIC_AUTH_USER || "admin";
    const password = process.env.BASIC_AUTH_PASSWORD || "password";

    // 認証情報をデコードして確認
    const [authType, credentials] = basicAuth.split(" ");
    if (authType === "Basic") {
      const decodedCredentials = Buffer.from(credentials, "base64").toString();
      const [inputUser, inputPassword] = decodedCredentials.split(":");

      if (inputUser === user && inputPassword === password) {
        return NextResponse.next(); // 認証成功時、次の処理に進む
      }
    }

    // 認証に失敗した場合、再度認証を要求
    return new Response("Invalid credentials", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }
  
  // パブリックなパスの場合は認証チェックをスキップ
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  // 静的ファイルやNext.jsの内部パスをスキップ
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // ファイル拡張子があるもの（画像、CSS、JSなど）
  ) {
    return NextResponse.next();
  }
  
  // JWTトークンの確認
  const token = req.cookies.get('auth-token')?.value;
  
  if (!token) {
    // APIの場合は401を返す
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: '認証が必要です。' },
        { status: 401 }
      );
    }
    // ページの場合はログインページにリダイレクト
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // トークンの有効性を確認
  try {
    verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    // APIの場合は401を返す
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: 'トークンが無効です。' },
        { status: 401 }
      );
    }
    // ページの場合はログインページにリダイレクト
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// ミドルウェアが適用されるパスを定義
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
