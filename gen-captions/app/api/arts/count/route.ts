import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// 作品数を取得するAPI
export async function GET(request: NextRequest) {
  // ログインユーザーを取得
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { error: "認証が必要です。" },
      { status: 401 }
    );
  }

  try {
    // 管理者の場合は全作品、一般ユーザーは自分の作品のみカウント
    const whereCondition = user.role === 'admin' ? {} : { userId: user.userId };
    
    const count = await prisma.art.count({
      where: whereCondition,
    });

    const response = NextResponse.json({ count });
    // キャッシュを無効化
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  } catch (error) {
    console.error("Error counting arts:", error);
    return NextResponse.json(
      { error: "作品数の取得に失敗しました。" },
      { status: 500 }
    );
  }
}