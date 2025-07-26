// 統一されたエラーハンドリングユーティリティ

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export class AppError extends Error {
  public readonly status: number;
  public readonly details?: any;

  constructor(message: string, status: number = 500, details?: any) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.details = details;
  }
}

// 統一されたエラーレスポンス形式
export const createErrorResponse = (error: ApiError) => {
  const response = {
    error: error.message,
    status: error.status,
    ...(error.details && { details: error.details }),
  };

  // 開発環境でのみスタックトレースを含める
  if (process.env.NODE_ENV === 'development' && error.details) {
    response.details = error.details;
  }

  return response;
};

// よく使用されるエラーの定数
export const ERROR_MESSAGES = {
  UNAUTHORIZED: '認証が必要です。',
  FORBIDDEN: 'アクセスが許可されていません。',
  NOT_FOUND: 'リソースが見つかりません。',
  INTERNAL_SERVER_ERROR: 'サーバー内部エラーが発生しました。',
  VALIDATION_ERROR: '入力データに問題があります。',
  DATABASE_ERROR: 'データベースエラーが発生しました。',
} as const;

// ログ出力用のヘルパー関数
export const logError = (error: Error | AppError, context?: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context || 'ERROR'}]`, error.message, error.stack);
  } else {
    // 本番環境では必要最小限の情報のみログ出力
    console.error(`[${context || 'ERROR'}]`, error.message);
  }
};