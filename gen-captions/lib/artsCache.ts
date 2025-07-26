import { DataItem } from "@/app/api/arts/route";

// メモリキャッシュのインターface
interface CacheEntry {
  data: DataItem[];
  total: number;
  timestamp: number;
  page: number;
  pageSize: number;
}

class ArtsCache {
  private cache = new Map<string, CacheEntry>();
  private readonly TTL = 5 * 60 * 1000; // 5分間

  // キャッシュキーを生成
  private generateKey(page: number, pageSize: number, userId?: string): string {
    return `${userId || 'guest'}-${page}-${pageSize}`;
  }

  // キャッシュからデータを取得
  get(page: number, pageSize: number, userId?: string): CacheEntry | null {
    const key = this.generateKey(page, pageSize, userId);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // TTLチェック
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return entry;
  }

  // キャッシュにデータを保存
  set(page: number, pageSize: number, data: DataItem[], total: number, userId?: string): void {
    const key = this.generateKey(page, pageSize, userId);
    
    this.cache.set(key, {
      data,
      total,
      timestamp: Date.now(),
      page,
      pageSize
    });
    
    // メモリ使用量制限（最大100エントリ）
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value as string;
      this.cache.delete(firstKey);
    }
  }

  // 特定ユーザーのキャッシュを削除
  invalidateUser(userId: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.startsWith(`${userId}-`)) {
        this.cache.delete(key);
      }
    });
  }

  // 全キャッシュをクリア
  clear(): void {
    this.cache.clear();
  }

  // キャッシュ統計情報
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// シングルトンインスタンス
export const artsCache = new ArtsCache();