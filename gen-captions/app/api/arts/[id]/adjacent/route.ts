import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// 隣接するアート作品のIDを取得するAPI
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // ログインユーザーを取得
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { error: "認証が必要です。" },
      { status: 401 }
    );
  }

  try {
    const currentId = parseInt(params.id);
    
    // 管理者の場合は全作品、一般ユーザーは自分の作品のみ対象
    const whereCondition = user.role === 'admin' ? {} : { userId: user.userId };

    // 前の作品（現在の作品より小さいIDで最大のもの）
    const prevArt = await prisma.art.findFirst({
      where: {
        ...whereCondition,
        id: {
          lt: currentId
        }
      },
      orderBy: {
        id: 'desc'
      },
      select: {
        id: true
      }
    });

    // 次の作品（現在の作品より大きいIDで最小のもの）
    const nextArt = await prisma.art.findFirst({
      where: {
        ...whereCondition,
        id: {
          gt: currentId
        }
      },
      orderBy: {
        id: 'asc'
      },
      select: {
        id: true
      }
    });

    return NextResponse.json({
      prevId: prevArt?.id || null,
      nextId: nextArt?.id || null
    });

  } catch (error) {
    console.error("Error fetching adjacent arts:", error);
    return NextResponse.json(
      { error: "隣接する作品の取得に失敗しました。" },
      { status: 500 }
    );
  }
}