import { DataItem } from "@/app/api/arts/route";
import { Dispatch, SetStateAction } from "react";

// メモリベースのキャッシュ（メイン）
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly maxSize = 100; // 最大100エントリ
  private readonly ttl = 10 * 60 * 1000; // 10分に延長

  set(key: string, data: any) {
    // サイズ制限チェック
    if (this.cache.size >= this.maxSize) {
      // 最も古いエントリを削除
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
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
      throw new Error("Failed to fetch data");
    }
    
    const data = await response.json();
    setData(data);
    
    // キャッシュに保存
    setCachedData(cacheKey, data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getArts = async (
  setData: Dispatch<SetStateAction<DataItem[]>>,
  setTotal: Dispatch<SetStateAction<number>>,
  page = 1,
  pageSize = 11
): Promise<void> => {
  const cacheKey = createCacheKey('list', page, pageSize);
  
  // キャッシュから取得を試行
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    // キャッシュヒット時も短い遅延でスケルトンを表示
    await new Promise(resolve => setTimeout(resolve, 200));
    setData(cachedData.data);
    const total = Math.ceil(cachedData.total / pageSize);
    setTotal(total);
    return;
  }

  try {
    const response = await fetch(`/api/arts?page=${page}&pageSize=${pageSize}`, {
      headers: {
        'Cache-Control': 'max-age=300' // 5分間キャッシュ
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    
    const data = await response.json();
    setData(data.data);
    const total = Math.ceil(data.total / pageSize);
    setTotal(total);
    
    // キャッシュに保存
    setCachedData(cacheKey, { data: data.data, total: data.total });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// キャッシュをクリアする関数（新しい作品作成時などに使用）
export const clearArtsCache = () => {
  if (typeof window === 'undefined') return;
  
  // メモリキャッシュのみクリア
  memoryCache.clear();
  console.debug('Memory cache cleared');
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
