import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // JWTトークンからユーザー情報を取得
    const tokenPayload = getUserFromRequest(request);
    
    if (!tokenPayload) {
      return NextResponse.json(
        { error: '認証が必要です。' },
        { status: 401 }
      );
    }

    // データベースから最新のユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: tokenPayload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: { arts: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません。' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        artCount: user._count.arts,
      },
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'ユーザー情報の取得中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}