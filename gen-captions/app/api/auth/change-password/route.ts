import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, verifyPassword, hashPassword, isValidPassword, generateToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const userPayload = await getUserFromRequest(request);
    if (!userPayload) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    // バリデーション
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '現在のパスワードと新しいパスワードを入力してください' },
        { status: 400 }
      );
    }

    if (!isValidPassword(newPassword)) {
      return NextResponse.json(
        { error: '新しいパスワードは8文字以上で、文字と数字を含む必要があります' },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: '新しいパスワードは現在のパスワードと異なるものを入力してください' },
        { status: 400 }
      );
    }

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userPayload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // 現在のパスワードを検証
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: '現在のパスワードが正しくありません' },
        { status: 400 }
      );
    }

    // 新しいパスワードをハッシュ化
    const hashedNewPassword = await hashPassword(newPassword);

    // パスワードを更新
    await prisma.user.update({
      where: { id: userPayload.userId },
      data: { password: hashedNewPassword },
    });

    // パスワード変更後に新しいJWTトークンを生成
    const newToken = await generateToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      role: user.role || undefined,
    });

    // レスポンスに新しいトークンをCookieとして設定
    const response = NextResponse.json(
      { 
        message: 'パスワードが正常に変更されました',
        tokenRefreshed: true 
      },
      { status: 200 }
    );

    // Cookieに新しいトークンを設定
    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7日間
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'パスワード変更処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}