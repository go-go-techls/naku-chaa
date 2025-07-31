import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    // バリデーション
    if (!content) {
      return NextResponse.json(
        { error: '内容は必須です' },
        { status: 400 }
      );
    }

    // ユーザー認証（必須）
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // フィードバックを保存
    const feedback = await prisma.feedback.create({
      data: {
        content,
        userId: user.userId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'フィードバックを送信しました',
      id: feedback.id,
    });

  } catch (error) {
    console.error('フィードバック送信エラー:', error);
    return NextResponse.json(
      { error: 'フィードバックの送信に失敗しました' },
      { status: 500 }
    );
  }
}

// 管理者用：フィードバック一覧取得
export async function GET(request: NextRequest) {
  try {
    // ユーザー認証
    const userPayload = await getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    // 管理者権限チェック
    const user = await prisma.user.findUnique({
      where: { id: userPayload.userId },
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '管理者権限が必要です' }, { status: 403 });
    }

    // フィードバック一覧取得
    const feedbacks = await prisma.feedback.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ feedbacks });

  } catch (error) {
    console.error('フィードバック取得エラー:', error);
    return NextResponse.json(
      { error: 'フィードバックの取得に失敗しました' },
      { status: 500 }
    );
  }
}