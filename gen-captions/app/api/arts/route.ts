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

// GETリクエストを処理するAPI関数
export async function GET(request: NextRequest) {
  // ログインユーザーを取得
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json(
      { error: "認証が必要です。" },
      { status: 401 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  try {
    // 管理者の場合は全作品、一般ユーザーは自分の作品のみ取得
    const whereCondition = user.role === 'admin' ? {} : { userId: user.userId };
    
    const arts = await prisma.art.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: "desc",
      },
      include: user.role === 'admin' ? {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      } : undefined,
    });
    
    const total = await prisma.art.count({
      where: whereCondition,
    });

    return NextResponse.json({ data: arts, total, page, pageSize });
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
    return NextResponse.json(
      { error: "認証が必要です。" },
      { status: 401 }
    );
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
    return NextResponse.json(newArt);
  } catch (error) {
    console.error("Error creating art:", error);
    return NextResponse.json(
      { error: "作品の作成に失敗しました。", details: (error as Error).message },
      { status: 500 }
    );
  }
}
