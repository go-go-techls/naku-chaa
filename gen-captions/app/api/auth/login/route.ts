import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken, isValidEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // バリデーション
    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードは必須です。' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください。' },
        { status: 400 }
      );
    }

    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません。' },
        { status: 401 }
      );
    }

    // パスワード検証
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません。' },
        { status: 401 }
      );
    }

    // JWT トークン生成
    const token = await generateToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      role: user.role,
    });

    // レスポンス作成（パスワードを除外）
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    // HttpOnly Cookieでトークンを設定
    const response = NextResponse.json({
      message: 'ログインしました。',
      user: userResponse,
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7日間
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'ログイン処理中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}