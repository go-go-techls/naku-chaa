import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken, isValidEmail, isValidPassword } from '@/lib/auth';
import { generateAvatar } from '@/lib/avatar';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

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

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: 'パスワードは8文字以上で、文字と数字を含む必要があります。' },
        { status: 400 }
      );
    }

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています。' },
        { status: 409 }
      );
    }

    // パスワードハッシュ化
    const hashedPassword = await hashPassword(password);

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name || null,
      },
    });

    // ユーザー作成後にアバターを生成して更新
    const avatar = generateAvatar(user.id);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { avatar },
    });

    // JWT トークン生成
    const token = await generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name || undefined,
      role: updatedUser.role,
    });

    // レスポンス作成（パスワードを除外）
    const userResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.createdAt,
    };

    // HttpOnly Cookieでトークンを設定
    const response = NextResponse.json({
      message: 'ユーザー登録が完了しました。',
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'ユーザー登録処理中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}