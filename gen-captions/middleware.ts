import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ミドルウェアは全てのリクエストに対して実行される
export function middleware(req: NextRequest) {
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

// ミドルウェアが適用されるパスを定義
export const config = {
  matcher: ["/(.*)", "/api/:path*"], // 全ページと API を対象にする
};
