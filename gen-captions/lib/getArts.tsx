import { DataItem } from "@/app/api/arts/route";
import { Dispatch, SetStateAction } from "react";

// メモリベースのキャッシュ（メイン）
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly maxSize = 20; // スマホ対応で最大20エントリに削減
  private readonly ttl = 5 * 60 * 1000; // 5分に短縮

  set(key: string, data: any) {
    // サイズ制限チェック
    if (this.cache.size >= this.maxSize) {
      // 最も古いエントリを削除
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    // 画像データを含む個別作品のキャッシュは軽量化
    let cacheData = data;
    if (key.startsWith('art-') && data.image) {
      // 画像データが非常に大きい場合のみキャッシュしない
      if (data.image.length > 500000) { // 500KB以上の場合
        return; // キャッシュしない
      }
    }

    this.cache.set(key, {
      data: cacheData,
      timestamp: Date.now()
    });
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // TTLチェック
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  // メモリ使用量チェック（スマホ対応）
  checkMemoryUsage() {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (window.performance as any)) {
      const memory = (window.performance as any).memory;
      if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
        // メモリ使用量が80%を超えた場合、キャッシュをクリア
        this.clear();
        console.warn('メモリ使用量が高いため、キャッシュをクリアしました');
      }
    }
  }
}

const memoryCache = new MemoryCache();

// メモリキャッシュのみ使用するため、SessionStorageのチェックは不要

// 軽量化関数は不要（メモリキャッシュのため）

// ブラウザレベルのキャッシュ管理
const createCacheKey = (id: number | string, page?: number, pageSize?: number) => {
  if (page !== undefined && pageSize !== undefined) {
    return `arts-list-${page}-${pageSize}`;
  }
  return `art-${id}`;
};

const getCachedData = (key: string) => {
  if (typeof window === 'undefined') return null;
  
  // メモリキャッシュから直接取得
  return memoryCache.get(key);
};

const setCachedData = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  
  // メモリキャッシュのみを使用（SessionStorageは使わない）
  memoryCache.set(key, data);
  console.debug(`Data cached in memory: ${key}`);
};

// SessionStorageを使わないため、この関数は不要

export const getArt = async (
  id: number,
  setData: Dispatch<SetStateAction<DataItem>>
): Promise<void> => {
  const cacheKey = createCacheKey(id);
  
  // メモリ使用量チェック
  memoryCache.checkMemoryUsage();
  
  // キャッシュから取得を試行
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    // キャッシュヒット時も短い遅延でローディング状態を表示
    await new Promise(resolve => setTimeout(resolve, 150));
    setData(cachedData);
    return;
  }

  try {
    const response = await fetch(`/api/arts/${id}`, {
      headers: {
        'Cache-Control': 'max-age=300' // 5分間キャッシュ
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch art: ${response.status}`);
    }
    
    const data = await response.json();
    setData(data);
    
    // キャッシュに保存
    setCachedData(cacheKey, data);
  } catch (error) {
    console.error("Error fetching art data:", error);
    // エラー時は空のデータを設定
    setData({} as DataItem);
  }
};

export const getArts = async (
  setData: Dispatch<SetStateAction<DataItem[]>>,
  setTotal: Dispatch<SetStateAction<number>>,
  page = 1,
  pageSize = 11,
  bypassCache = false
): Promise<void> => {
  const cacheKey = createCacheKey('list', page, pageSize);
  
  // キャッシュから取得を試行（bypassCacheがtrueの場合はスキップ）
  if (!bypassCache) {
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      // キャッシュヒット時も短い遅延でスケルトンを表示
      await new Promise(resolve => setTimeout(resolve, 200));
      setData(cachedData.data);
      const total = Math.ceil(cachedData.total / pageSize);
      setTotal(total);
      return;
    }
  }

  try {
    const response = await fetch(`/api/arts?page=${page}&pageSize=${pageSize}`, {
      headers: {
        'Cache-Control': 'max-age=300' // 5分間キャッシュ
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const data = await response.json();
    setData(data.data);
    const total = Math.ceil(data.total / pageSize);
    setTotal(total);
    
    // キャッシュに保存
    setCachedData(cacheKey, { data: data.data, total: data.total });
  } catch (error) {
    console.error("Error fetching arts data:", error);
    // エラー時は空配列を設定してクラッシュを防ぐ
    setData([]);
    setTotal(1);
  }
};

// キャッシュをクリアする関数（新しい作品作成時などに使用）
export const clearArtsCache = (shouldReload = false) => {
  if (typeof window === 'undefined') return;
  
  // メモリキャッシュのみクリア
  memoryCache.clear();
  console.debug('Memory cache cleared');
  
  // リロードが必要な場合のみ実行
  if (shouldReload) {
    window.location.reload();
  }
};

// 隣接するアート作品のIDを取得する関数
export const getAdjacentArtIds = async (currentId: number): Promise<{
  prevId: number | null;
  nextId: number | null;
}> => {
  try {
    const response = await fetch(`/api/arts/${currentId}/adjacent`, {
      headers: {
        'Cache-Control': 'max-age=300'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        prevId: data.prevId,
        nextId: data.nextId
      };
    }
  } catch (error) {
    console.error('Failed to fetch adjacent art IDs:', error);
  }
  
  return { prevId: null, nextId: null };
};
