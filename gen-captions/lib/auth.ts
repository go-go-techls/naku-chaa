import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

// JWT secret (環境変数から取得、デフォルト値は開発用)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ユーザー情報の型定義
export interface User {
  id: string;
  email: string;
  name?: string;
}

// JWT トークンのペイロード型定義
interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// パスワードハッシュ化
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// パスワード検証
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT トークン生成
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // 7日間有効
  });
}

// JWT トークン検証
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// リクエストからトークンを取得
export function getTokenFromRequest(request: NextRequest): string | null {
  // Authorization ヘッダーから取得
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Cookieから取得
  const cookieToken = request.cookies.get('auth-token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

// リクエストからユーザー情報を取得
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return verifyToken(token);
}

// メール形式の検証
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// パスワード強度の検証
export function isValidPassword(password: string): boolean {
  // 最低8文字、少なくとも1つの文字と1つの数字
  return password.length >= 8 && /^(?=.*[A-Za-z])(?=.*\d)/.test(password);
}