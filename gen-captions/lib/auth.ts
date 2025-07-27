import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha256';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

// JWT secret (環境変数から取得、デフォルト値は開発用)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

// ユーザー情報の型定義
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

// JWT トークンのペイロード型定義
interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

// パスワードハッシュ化
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(32));
  const hash = pbkdf2(sha256, password, salt, { c: 100000, dkLen: 32 });
  
  // salt + hash をBase64エンコードして返す
  const combined = new Uint8Array(salt.length + hash.length);
  combined.set(salt);
  combined.set(hash, salt.length);
  
  return btoa(String.fromCharCode.apply(null, Array.from(combined)));
}

// パスワード検証
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    // Base64デコード
    const combined = new Uint8Array(atob(hashedPassword).split('').map(c => c.charCodeAt(0)));
    
    // saltとhashを分離
    const salt = combined.slice(0, 32);
    const storedHash = combined.slice(32);
    
    // 入力されたパスワードをハッシュ化
    const inputHash = pbkdf2(sha256, password, salt, { c: 100000, dkLen: 32 });
    
    // ハッシュを比較
    return storedHash.every((byte, index) => byte === inputHash[index]);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// JWT トークン生成
export async function generateToken(user: User): Promise<string> {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7日間有効
    .sign(secret);
}

// JWT トークン検証
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
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
export async function getUserFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }

  return await verifyToken(token);
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