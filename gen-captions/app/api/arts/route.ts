// app/routes/api/results.tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export type DataItem = {
  id: number;
  title: string;
  feature: string;
  advantage: string;
  advice: string;
  image: string;
  rating: number;
  comment: string;
  character: string;
  is_public_allowed: boolean;
};

// キャッシュ設定を追加
export const revalidate = 300; // 5分間キャッシュ

// GETリクエストを処理するAPI関数
export async function GET(request: NextRequest) {
  // ログインユーザーを取得
  const user = getUserFromRequest(request);
  console.log(
    "一覧取得API - 認証チェック結果:",
    user ? "ログイン済み" : "未ログイン"
  );

  if (!user) {
    console.log("一覧取得API - 認証エラー: ユーザーが見つかりません");
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  try {
    // デバッグ: ユーザー情報をログ出力
    console.log("一覧取得API - ユーザー情報:", {
      userId: user.userId,
      email: user.email,
      role: user.role,
    });

    // 管理者の場合は全作品、一般ユーザーは自分の作品のみ取得
    // テスト用: 管理者でも自分の作品のみ表示（本番では元に戻す）
    const whereCondition = { userId: user.userId };
    // const whereCondition = user.role === 'admin' ? {} : { userId: user.userId };
    console.log("一覧取得API - フィルタ条件:", whereCondition);

    const arts = await prisma.art.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: "desc",
      },
      include:
        user.role === "admin"
          ? {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                },
              },
            }
          : undefined,
    });

    const total = await prisma.art.count({
      where: whereCondition,
    });

    // デバッグ: 取得したデータのuserIdをログ出力
    console.log("一覧取得API - 取得した作品数:", arts.length);
    console.log(
      "一覧取得API - 取得した作品のuserID:",
      arts.map((art) => ({
        id: art.id,
        userId: art.userId,
        isCurrentUser: art.userId === user.userId,
      }))
    );

    // セキュリティチェック: 他のユーザーの作品が含まれていないか確認
    const otherUserArts = arts.filter((art) => art.userId !== user.userId);
    if (otherUserArts.length > 0) {
      console.error(
        "🚨 セキュリティ警告: 他のユーザーの作品が含まれています!",
        otherUserArts.map((art) => ({ id: art.id, userId: art.userId }))
      );
    }

    const response = NextResponse.json({ data: arts, total, page, pageSize });

    // キャッシュヘッダーを設定
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );

    return response;
  } catch (error) {
    console.error("Error fetching arts:", error);
    return NextResponse.json(
      { error: "作品の取得に失敗しました。" },
      { status: 500 }
    );
  }
}

// POSTリクエストを処理するAPI関数
export async function POST(request: Request) {
  // ログインユーザーを取得
  const user = getUserFromRequest(request as NextRequest);
  if (!user) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  try {
    const data = await request.json();
    console.log("Received data:", data);

    // ユーザーIDを追加
    const artData = {
      ...data,
      userId: user.userId,
    };

    const newArt: DataItem = await prisma.art.create({ data: artData });

    // レスポンスヘッダーにキャッシュ無効化の指示を追加
    const response = NextResponse.json(newArt);
    response.headers.set("X-Cache-Control", "no-cache");
    response.headers.set("X-New-Art-Created", "true");

    return response;
  } catch (error) {
    console.error("Error creating art:", error);
    return NextResponse.json(
      {
        error: "作品の作成に失敗しました。",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
