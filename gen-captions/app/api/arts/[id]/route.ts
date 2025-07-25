// app/routes/api/results.tsx
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // ログインユーザーを取得
  const user = getUserFromRequest(request as NextRequest);
  if (!user) {
    return NextResponse.json(
      { error: "認証が必要です。" },
      { status: 401 }
    );
  }

  const id = params.id;
  const numericId = parseInt(id);

  try {
    // ログインユーザーの作品のみ取得
    const art = await prisma.art.findFirst({
      where: {
        id: numericId,
        userId: user.userId,
      },
    });

    if (art) {
      return NextResponse.json(art);
    } else {
      return NextResponse.json(
        { error: "作品が見つかりません。" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching art:", error);
    return NextResponse.json(
      { error: "作品の取得に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // ログインユーザーを取得
  const user = getUserFromRequest(request as NextRequest);
  if (!user) {
    return NextResponse.json(
      { error: "認証が必要です。" },
      { status: 401 }
    );
  }

  const id = params.id;
  const numericId = parseInt(id);

  try {
    // まず、削除対象の作品がログインユーザーのものか確認
    const art = await prisma.art.findFirst({
      where: {
        id: numericId,
        userId: user.userId,
      },
    });

    if (!art) {
      return NextResponse.json(
        { error: "作品が見つからないか、削除権限がありません。" },
        { status: 404 }
      );
    }

    // 削除実行
    const deletedArt = await prisma.art.delete({
      where: { id: numericId },
    });

    console.log("Deleted art:", deletedArt);
    return NextResponse.json({ message: "作品が削除されました。", art: deletedArt });
  } catch (error) {
    console.error("Error deleting art:", error);
    return NextResponse.json(
      { error: "作品の削除に失敗しました。" },
      { status: 500 }
    );
  }
}
